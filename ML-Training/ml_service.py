"""
ML Model Inference Service
Loads and runs the cosmetic fake/real detection model
"""

import sys
import json
import os
from pathlib import Path

# Try to import dependencies
try:
    import numpy as np
    from PIL import Image
except ImportError as e:
    print(json.dumps({
        "error": f"Missing dependency: {str(e)}",
        "status": "UNKNOWN",
        "confidenceScore": 0,
        "reasoning": ["Python dependencies not installed. Run: pip install pillow numpy tensorflow"],
        "productName": "Setup Error",
        "brand": "System",
        "extractedText": []
    }))
    sys.exit(1)

# Try to import TensorFlow
try:
    import tensorflow as tf
    # Suppress TensorFlow warnings
    tf.get_logger().setLevel('ERROR')
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
except ImportError:
    print(json.dumps({
        "error": "TensorFlow not installed",
        "status": "UNKNOWN",
        "confidenceScore": 0,
        "reasoning": ["TensorFlow not found. Run: pip install tensorflow"],
        "productName": "Setup Error",
        "brand": "System",
        "extractedText": []
    }))
    sys.exit(1)

# Model configuration
MODEL_PATH = Path(__file__).parent / 'cosmetic_fake_real_model.keras'
TARGET_SIZE = (224, 224)  # Standard image size for the model

# Global model variable
_model = None

def load_model():
    """Load the Keras model (cached globally)"""
    global _model, MODEL_PATH
    
    if _model is None:
        if not MODEL_PATH.exists():
            # Check parent directory fallback
            PARENT_MODEL_PATH = Path(__file__).parent.parent / 'cosmetic_fake_real_model.keras'
            if PARENT_MODEL_PATH.exists():
                MODEL_PATH = PARENT_MODEL_PATH
            else:
                raise FileNotFoundError(f"Model file not found at: {MODEL_PATH} or {PARENT_MODEL_PATH}")
        
        try:
            _model = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
            print(f"✓ Model loaded: {MODEL_PATH.name}", file=sys.stderr)
        except Exception as e:
            raise Exception(f"Failed to load model: {str(e)}")
    
    return _model

def preprocess_image(image_path):
    """
    Preprocess image for model input
    - Resize to TARGET_SIZE
    - Convert to RGB
    - Normalize to [0, 1]
    - Add batch dimension
    """
    try:
        # Load and convert image
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        
        # Convert to array and normalize
        img_array = np.array(img, dtype=np.float32) / 255.0
        
        # Add batch dimension [1, 224, 224, 3]
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
        
    except Exception as e:
        raise Exception(f"Image preprocessing failed: {str(e)}")

def predict(image_path):
    """
    Run prediction on the image
    Returns: fake_probability (float between 0 and 1)
    """
    try:
        model = load_model()
        processed_image = preprocess_image(image_path)
        
        # Run prediction
        prediction = model.predict(processed_image, verbose=0)
        
        # Extract probability (binary classification)
        # Adjust based on your model's output format
        fake_prob = float(prediction[0][0])
        
        return fake_prob
        
    except Exception as e:
        raise Exception(f"Prediction failed: {str(e)}")

def analyze_product(image_path):
    """
    Analyze product image and return structured results
    """
    try:
        # Get ML prediction
        fake_prob = predict(image_path)
        
        # Determine status based on probability thresholds
        if fake_prob < 0.35:
            status = "AUTHENTIC"
            confidence = int((1 - fake_prob) * 100)
            reasoning = [
                "Visual analysis indicates authentic product",
                "Packaging quality meets genuine standards",
                f"Authenticity probability: {(1-fake_prob)*100:.1f}%"
            ]
        elif fake_prob < 0.65:
            status = "SUSPICIOUS"
            confidence = max(int((1 - abs(fake_prob - 0.5) * 2) * 100), 50)
            reasoning = [
                "Mixed authenticity signals detected",
                "Further verification recommended",
                f"Confidence level: {confidence}%"
            ]
        else:
            status = "FAKE"
            confidence = int(fake_prob * 100)
            reasoning = [
                "Strong indicators of counterfeit product detected",
                "Packaging analysis shows inconsistencies",
                f"Counterfeit probability: {fake_prob*100:.1f}%"
            ]
        
        # Build response matching frontend AnalysisResult interface
        result = {
            "status": status,
            "confidenceScore": min(confidence, 100),
            "reasoning": reasoning,
            "productName": "Cosmetic Product",
            "brand": "ML Visual Analysis",
            "extractedText": [f"ML Confidence: {confidence}%", f"Probability Score: {fake_prob:.3f}"],
            "batchCode": "",
            "officialWebsite": "",
            "reportingUrl": "",
            "mlProbability": round(fake_prob, 4)
        }
        
        return result
        
    except Exception as e:
        # Return error in expected format
        return {
            "error": str(e),
            "status": "UNKNOWN",
            "confidenceScore": 0,
            "reasoning": [f"Analysis error: {str(e)}"],
            "productName": "Error",
            "brand": "System",
            "extractedText": [],
            "batchCode": "",
            "officialWebsite": "",
            "reportingUrl": ""
        }

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No image path provided",
            "status": "UNKNOWN",
            "confidenceScore": 0,
            "reasoning": ["Usage: python ml_service.py <image_path>"],
            "productName": "Error",
            "brand": "System",
            "extractedText": []
        }))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({
            "error": f"Image file not found: {image_path}",
            "status": "UNKNOWN",
            "confidenceScore": 0,
            "reasoning": ["File does not exist"],
            "productName": "Error",
            "brand": "System",
            "extractedText": []
        }))
        sys.exit(1)
    
    try:
        result = analyze_product(image_path)
        print(json.dumps(result))
        sys.exit(0 if "error" not in result else 1)
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "status": "UNKNOWN",
            "confidenceScore": 0,
            "reasoning": [f"Fatal error: {str(e)}"],
            "productName": "Error",
            "brand": "System",
            "extractedText": []
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
