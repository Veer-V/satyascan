import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// @route   POST /api/scans
// @desc    Save a new scan result
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { id, date, thumbnail, result } = req.body;
    
    console.log(`📥 Received scan save request - ID: ${id}`);
    
    // Validate required fields
    if (!id || !thumbnail || !result) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields: id, thumbnail, result' 
      });
    }
    
    // Validate result object
    if (!result.productName || !result.brand || !result.status) {
      console.error('❌ Validation failed: Incomplete result object');
      return res.status(400).json({ 
        error: 'Result must include productName, brand, and status' 
      });
    }
    
    console.log(`📝 Creating scan: ${result.brand} - ${result.productName} [${result.status}]`);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('scan_history')
      .insert([{
        scan_id: id,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        thumbnail,
        product_name: result.productName,
        brand: result.brand,
        status: result.status,
        confidence_score: result.confidenceScore || 0,
        reasoning: result.reasoning || [],
        manufacturing_date: result.manufacturingDate || null,
        batch_code: result.batchCode || null,
        official_website: result.officialWebsite || null,
        reporting_url: result.reportingUrl || null,
        extracted_text: result.extractedText || []
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      
      // Handle duplicate key error (unique constraint violation)
      if (error.code === '23505') {
        console.warn(`⚠️ Duplicate scan ID: ${id}`);
        return res.status(409).json({ 
          error: 'Scan with this ID already exists' 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to save scan', 
        details: error.message 
      });
    }
    
    console.log(`✅ Scan saved successfully - ID: ${id}`);
    
    res.status(201).json({
      message: 'Scan saved successfully',
      data: {
        id: data.scan_id,
        date: data.date,
        thumbnail: data.thumbnail,
        result: {
          productName: data.product_name,
          brand: data.brand,
          status: data.status,
          confidenceScore: data.confidence_score,
          reasoning: data.reasoning,
          manufacturingDate: data.manufacturing_date,
          batchCode: data.batch_code,
          officialWebsite: data.official_website,
          reportingUrl: data.reporting_url,
          extractedText: data.extracted_text
        }
      }
    });
  } catch (error) {
    console.error('❌ Error saving scan:', error);
    res.status(500).json({ 
      error: 'Failed to save scan', 
      details: error.message 
    });
  }
});

// @route   GET /api/scans
// @desc    Get all scan history
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit, status, brand } = req.query;
    
    console.log(`📋 Fetching scans - Filters: ${JSON.stringify({ limit, status, brand })}`);
    
    // Build query
    let query = supabase
      .from('scan_history')
      .select('*')
      .order('date', { ascending: false });
    
    // Apply filters
    if (status) {
      query = query.eq('status', status.toUpperCase());
    }
    if (brand) {
      query = query.ilike('brand', `%${brand}%`);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Error fetching scans:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch scans', 
        details: error.message 
      });
    }
    
    // Transform to match frontend format
    const formattedScans = data.map(scan => ({
      id: scan.scan_id,
      date: scan.date,
      thumbnail: scan.thumbnail,
      result: {
        productName: scan.product_name,
        brand: scan.brand,
        status: scan.status,
        confidenceScore: scan.confidence_score,
        reasoning: scan.reasoning,
        manufacturingDate: scan.manufacturing_date,
        batchCode: scan.batch_code,
        officialWebsite: scan.official_website,
        reportingUrl: scan.reporting_url,
        extractedText: scan.extracted_text
      }
    }));
    
    console.log(`✅ Fetched ${formattedScans.length} scans from database`);
    
    res.json({
      count: formattedScans.length,
      data: formattedScans
    });
  } catch (error) {
    console.error('❌ Error fetching scans:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scans', 
      details: error.message 
    });
  }
});

// @route   GET /api/scans/stats/summary
// @desc    Get statistics summary
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    // Get total scans count
    const { count: totalScans, error: totalError } = await supabase
      .from('scan_history')
      .select('*', { count: 'exact', head: true });
    
    // Get fake/suspicious scans count
    const { count: fakeScans, error: fakeError } = await supabase
      .from('scan_history')
      .select('*', { count: 'exact', head: true })
      .in('status', ['FAKE', 'SUSPICIOUS']);
    
    // Get authentic scans count
    const { count: authenticScans, error: authError } = await supabase
      .from('scan_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'AUTHENTIC');
    
    if (totalError || fakeError || authError) {
      const error = totalError || fakeError || authError;
      console.error('Error fetching stats:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch statistics', 
        details: error.message 
      });
    }
    
    res.json({
      totalScans: totalScans || 0,
      fakeScans: fakeScans || 0,
      authenticScans: authenticScans || 0,
      fakePercentage: totalScans > 0 ? ((fakeScans / totalScans) * 100).toFixed(1) : '0.0'
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics', 
      details: error.message 
    });
  }
});

// @route   GET /api/scans/:id
// @desc    Get a specific scan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .eq('scan_id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Scan not found' });
      }
      console.error('Error fetching scan:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch scan', 
        details: error.message 
      });
    }
    
    res.json({
      id: data.scan_id,
      date: data.date,
      thumbnail: data.thumbnail,
      result: {
        productName: data.product_name,
        brand: data.brand,
        status: data.status,
        confidenceScore: data.confidence_score,
        reasoning: data.reasoning,
        manufacturingDate: data.manufacturing_date,
        batchCode: data.batch_code,
        officialWebsite: data.official_website,
        reportingUrl: data.reporting_url,
        extractedText: data.extracted_text
      }
    });
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scan', 
      details: error.message 
    });
  }
});

// @route   DELETE /api/scans/:id
// @desc    Delete a scan by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .delete()
      .eq('scan_id', req.params.id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Scan not found' });
      }
      console.error('Error deleting scan:', error);
      return res.status(500).json({ 
        error: 'Failed to delete scan', 
        details: error.message 
      });
    }
    
    res.json({ 
      message: 'Scan deleted successfully',
      id: data.scan_id
    });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({ 
      error: 'Failed to delete scan', 
      details: error.message 
    });
  }
});

export default router;
