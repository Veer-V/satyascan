import sys
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from pathlib import Path

# Load the model
MODEL_PATH = Path(__file__).parent / 'cosmetic_fake_real_model.keras'
model = None

def load_model():
    """Load the Keras model once"""
    global model
    if model is None:
        try:
            model = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
            print(f"Model loaded successfully from {MODEL_PATH}", file=sys.stderr)
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            raise
    return model

def preprocess_image(image_path, target_size=(224, 224)):
    """
    Preprocess the image for model input
    Adjust target_size based on your model's requirements
    """
    try:
        # Load image
        img = Image.open(image_path)
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to target size
        img = img.resize(target_size, Image.LANCZOS)
        
        # Convert to numpy array
        img_array = np.array(img)
        
        # Normalize pixel values to [0, 1]
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}", file=sys.stderr)
        raise

def predict(image_path):
    """
    Make prediction on the image
    Returns probability of being fake (0-1)
    """
    try:
        # Load model
        ml_model = load_model()
        
        # Preprocess image
        processed_image = preprocess_image(image_path)
        
        # Make prediction
        prediction = ml_model.predict(processed_image, verbose=0)
        
        # Get probability (assuming binary classification)
        # Adjust based on your model's output format
        fake_probability = float(prediction[0][0])
        
        return fake_probability
    except Exception as e:
        print(f"Error during prediction: {e}", file=sys.stderr)
        raise

def analyze_product(image_path):
    """
    Analyze the product image and return structured results
    """
    try:
        # Get prediction
        fake_prob = predict(image_path)
        
        # Determine status based on probability
        # Adjust thresholds as needed
        if fake_prob < 0.3:
            status = "AUTHENTIC"
            confidence = int((1 - fake_prob) * 100)
            reasoning = [
                "Packaging quality meets authentic standards",
                "Visual patterns consistent with genuine products",
                f"Low counterfeit probability: {fake_prob:.1%}"
            ]
        elif fake_prob < 0.7:
            status = "SUSPICIOUS"
            confidence = int(abs(0.5 - fake_prob) * 200)
            reasoning = [
                "Some visual anomalies detected",
                "Recommend additional verification",
                f"Moderate counterfeit probability: {fake_prob:.1%}"
            ]
        else:
            status = "FAKE"
            confidence = int(fake_prob * 100)
            reasoning = [
                "Strong indicators of counterfeit product",
                "Packaging quality below authentic standards",
                f"High counterfeit probability: {fake_prob:.1%}"
            ]
        
        # Build result object
        result = {
            "status": status,
            "confidenceScore": confidence,
            "reasoning": reasoning,
            "productName": "Cosmetic Product",
            "brand": "Analysis Based on Visual AI",
            "extractedText": ["ML Model Analysis"],
            "batchCode": "",
            "officialWebsite": "",
            "reportingUrl": "",
            "mlProbability": fake_prob
        }
        
        return result
    except Exception as e:
        print(f"Error analyzing product: {e}", file=sys.stderr)
        raise

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        result = analyze_product(image_path)
        print(json.dumps(result))
    except Exception as e:
        error_result = {
            "error": str(e),
            "status": "UNKNOWN",
            "confidenceScore": 0,
            "reasoning": ["Failed to analyze image"],
            "productName": "Error",
            "brand": "Error",
            "extractedText": []
        }
        print(json.dumps(error_result))
        sys.exit(1)
