// ============================================
// Unit Converter App - JavaScript
// ============================================

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ============================================
// Initialize App
// ============================================

function initializeApp() {
    setupNavigation();
    setupConverterEvents();
}

// ============================================
// Navigation Setup
// ============================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update category (placeholder for now)
            const category = this.getAttribute('data-category');
            updateConverterCategory(category);
        });
    });
}

// ============================================
// Update Converter Category
// ============================================

function updateConverterCategory(category) {
    const categoryTitle = document.getElementById('category-title');
    const categoryNames = {
        'length': 'Length Converter',
        'weight': 'Weight Converter',
        'temperature': 'Temperature Converter',
        'volume': 'Volume Converter'
    };
    
    categoryTitle.textContent = categoryNames[category] || 'Converter';
    console.log('Category changed to:', category);
}

// ============================================
// Setup Converter Events
// ============================================

function setupConverterEvents() {
    const convertButton = document.querySelector('.btn-convert');
    const fromValue = document.getElementById('from-value');
    const toValue = document.getElementById('to-value');
    const resultInfo = document.getElementById('result-info');
    
    // Convert on button click
    convertButton.addEventListener('click', handleConversion);
    
    // Convert on input change (real-time conversion)
    fromValue.addEventListener('input', handleConversion);
    fromValue.addEventListener('change', handleConversion);
    
    // Also convert when units are changed
    document.getElementById('from-unit').addEventListener('change', handleConversion);
    document.getElementById('to-unit').addEventListener('change', handleConversion);
}

// ============================================
// Handle Conversion
// ============================================

function handleConversion() {
    const fromValue = parseFloat(document.getElementById('from-value').value);
    const toValue = document.getElementById('to-value');
    const resultInfo = document.getElementById('result-info');
    
    // Validate input
    if (isNaN(fromValue) || fromValue === '') {
        toValue.value = '';
        resultInfo.textContent = '';
        resultInfo.classList.remove('success', 'error');
        return;
    }
    
    // Placeholder conversion (will be implemented with actual conversion logic)
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    // Simple placeholder: just copy the value for now
    const result = fromValue;
    
    // Update result field
    toValue.value = result.toFixed(4);
    
    // Show result info
    resultInfo.textContent = `${fromValue} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
    resultInfo.classList.add('success');
    resultInfo.classList.remove('error');
}

// ============================================
// Placeholder: Conversion Formulas
// (To be implemented in next steps)
// ============================================

/*
Length conversion factors (to meter):
- meter: 1
- kilometer: 1000
- centimeter: 0.01
- mile: 1609.34
- yard: 0.9144
- foot: 0.3048
- inch: 0.0254
*/

/*
Weight conversion factors (to kilogram):
- kilogram: 1
- gram: 0.001
- milligram: 0.000001
- pound: 0.453592
- ounce: 0.0283495
- ton: 1000
*/

/*
Volume conversion factors (to liter):
- liter: 1
- milliliter: 0.001
- gallon: 3.78541
- quart: 0.946353
- pint: 0.473176
- cup: 0.236588
*/

/*
Temperature formulas:
- Celsius to Fahrenheit: (C × 9/5) + 32
- Fahrenheit to Celsius: (F - 32) × 5/9
- Celsius to Kelvin: C + 273.15
- Kelvin to Celsius: K - 273.15
*/
