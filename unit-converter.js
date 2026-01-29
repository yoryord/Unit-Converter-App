// ============================================
// Unit Converter App - JavaScript
// ============================================

// Current Active Category
let activeCategory = 'length';

// Global exchange rates object
let exchangeRates = {
    'usd': 1.0,
    'eur': 0.92,
    'gbp': 0.79
};

let ratesLastUpdated = null;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    fetchExchangeRates();
});

function initializeApp() {
    setupNavigation();
    setupConverterEvents();
}

// ============================================
// Fetch Exchange Rates from API
// ============================================

async function fetchExchangeRates() {
    try {
        // Using open.er-api.com API (free, no API key required)
        // This API returns rates for all currencies based on a base currency
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        
        if (data.result !== 'success') {
            throw new Error('API returned error');
        }
        
        // Update exchange rates with real-time data
        exchangeRates = {
            'usd': 1.0,
            'eur': data.rates.EUR,
            'gbp': data.rates.GBP
        };
        
        ratesLastUpdated = new Date().toLocaleString();
        
        console.log('Exchange rates updated successfully:', exchangeRates);
        console.log('Last updated:', ratesLastUpdated);
        
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        console.log('Using fallback exchange rates');
        // Fallback rates are already set in the global variable
    }
    
    // Refresh rates every 6 hours (21600000 milliseconds)
    setTimeout(fetchExchangeRates, 21600000);
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
    activeCategory = category;
    
    // Hide all converter sections
    document.getElementById('length-converter').style.display = 'none';
    document.getElementById('temperature-converter').style.display = 'none';
    document.getElementById('currency-converter').style.display = 'none';
    
    // Show active converter section
    if (category === 'length') {
        document.getElementById('length-converter').style.display = 'block';
    } else if (category === 'temperature') {
        document.getElementById('temperature-converter').style.display = 'block';
    } else if (category === 'currency') {
        document.getElementById('currency-converter').style.display = 'block';
    }
    
    console.log('Category changed to:', category);
}

// ============================================
// Setup Converter Events
// ============================================

function setupConverterEvents() {
    // Length Converter Events
    const lengthConvertButton = document.querySelector('.btn-convert');
    const lengthFromValue = document.getElementById('from-value');
    
    lengthConvertButton.addEventListener('click', handleLengthConversion);
    lengthFromValue.addEventListener('input', handleLengthConversion);
    lengthFromValue.addEventListener('change', handleLengthConversion);
    document.getElementById('from-unit').addEventListener('change', handleLengthConversion);
    document.getElementById('to-unit').addEventListener('change', handleLengthConversion);
    
    // Temperature Converter Events
    const tempConvertButton = document.querySelector('.btn-convert-temp');
    const tempFromValue = document.getElementById('from-value-temp');
    
    tempConvertButton.addEventListener('click', handleTemperatureConversion);
    tempFromValue.addEventListener('input', handleTemperatureConversion);
    tempFromValue.addEventListener('change', handleTemperatureConversion);
    document.getElementById('from-unit-temp').addEventListener('change', handleTemperatureConversion);
    document.getElementById('to-unit-temp').addEventListener('change', handleTemperatureConversion);
    
    // Currency Converter Events
    const currConvertButton = document.querySelector('.btn-convert-curr');
    const currFromValue = document.getElementById('from-value-curr');
    
    currConvertButton.addEventListener('click', handleCurrencyConversion);
    currFromValue.addEventListener('input', handleCurrencyConversion);
    currFromValue.addEventListener('change', handleCurrencyConversion);
    document.getElementById('from-unit-curr').addEventListener('change', handleCurrencyConversion);
    document.getElementById('to-unit-curr').addEventListener('change', handleCurrencyConversion);
}

// ============================================
// Length Conversion Factors (to meters)
// ============================================

const lengthConversionFactors = {
    'millimeter': 0.001,
    'centimeter': 0.01,
    'meter': 1,
    'kilometer': 1000,
    'inch': 0.0254,
    'foot': 0.3048,
    'yard': 0.9144,
    'mile': 1609.34
};

const unitDisplayNames = {
    'millimeter': 'mm',
    'centimeter': 'cm',
    'meter': 'm',
    'kilometer': 'km',
    'inch': 'in',
    'foot': 'ft',
    'yard': 'yd',
    'mile': 'mi'
};

// ============================================
// Handle Length Conversion
// ============================================

function handleLengthConversion() {
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
    
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    // Convert to meters first, then to target unit
    const valueInMeters = fromValue * lengthConversionFactors[fromUnit];
    const result = valueInMeters / lengthConversionFactors[toUnit];
    
    // Determine decimal places based on result size
    let decimalPlaces = 4;
    if (result >= 1000) {
        decimalPlaces = 2;
    } else if (result >= 100) {
        decimalPlaces = 3;
    }
    
    // Update result field
    toValue.value = result.toFixed(decimalPlaces);
    
    // Get display names
    const fromDisplay = unitDisplayNames[fromUnit];
    const toDisplay = unitDisplayNames[toUnit];
    
    // Show result info
    resultInfo.textContent = `${fromValue} ${fromDisplay} = ${result.toFixed(decimalPlaces)} ${toDisplay}`;
    resultInfo.classList.add('success');
    resultInfo.classList.remove('error');
}

// ============================================
// Temperature Conversion Formulas
// ============================================

const temperatureConversions = {
    'celsius': {
        'celsius': (val) => val,
        'fahrenheit': (val) => (val * 9/5) + 32,
        'kelvin': (val) => val + 273.15
    },
    'fahrenheit': {
        'celsius': (val) => (val - 32) * 5/9,
        'fahrenheit': (val) => val,
        'kelvin': (val) => (val - 32) * 5/9 + 273.15
    },
    'kelvin': {
        'celsius': (val) => val - 273.15,
        'fahrenheit': (val) => (val - 273.15) * 9/5 + 32,
        'kelvin': (val) => val
    }
};

const temperatureDisplayNames = {
    'celsius': '°C',
    'fahrenheit': '°F',
    'kelvin': 'K'
};

// ============================================
// Handle Temperature Conversion
// ============================================

function handleTemperatureConversion() {
    const fromValue = parseFloat(document.getElementById('from-value-temp').value);
    const toValue = document.getElementById('to-value-temp');
    const resultInfo = document.getElementById('result-info-temp');
    
    // Validate input
    if (isNaN(fromValue) || fromValue === '') {
        toValue.value = '';
        resultInfo.textContent = '';
        resultInfo.classList.remove('success', 'error');
        return;
    }
    
    const fromUnit = document.getElementById('from-unit-temp').value;
    const toUnit = document.getElementById('to-unit-temp').value;
    
    // Check if Kelvin is the source and value is negative
    if (fromUnit === 'kelvin' && fromValue < 0) {
        toValue.value = '';
        resultInfo.textContent = 'Error: Temperature in Kelvin cannot be negative';
        resultInfo.classList.add('error');
        resultInfo.classList.remove('success');
        return;
    }
    
    // Perform conversion
    const conversionFunction = temperatureConversions[fromUnit][toUnit];
    const result = conversionFunction(fromValue);
    
    // Check if result temperature is below absolute zero
    if (toUnit === 'kelvin' && result < 0) {
        toValue.value = '';
        resultInfo.textContent = 'Error: Resulting temperature below absolute zero';
        resultInfo.classList.add('error');
        resultInfo.classList.remove('success');
        return;
    }
    
    // Determine decimal places
    let decimalPlaces = 2;
    if (Math.abs(result) < 1) {
        decimalPlaces = 4;
    }
    
    // Update result field
    toValue.value = result.toFixed(decimalPlaces);
    
    // Get display names
    const fromDisplay = temperatureDisplayNames[fromUnit];
    const toDisplay = temperatureDisplayNames[toUnit];
    
    // Show result info
    resultInfo.textContent = `${fromValue} ${fromDisplay} = ${result.toFixed(decimalPlaces)} ${toDisplay}`;
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

// ============================================
// Currency Exchange Rates
// (Fetched from API at runtime - fallback rates below)
// ============================================

// Exchange rates are now fetched from API in fetchExchangeRates()
// This is just for reference - actual rates are stored in global 'exchangeRates' variable

const currencyDisplayNames = {
    'usd': '$',
    'eur': '€',
    'gbp': '£'
};

// ============================================
// Handle Currency Conversion
// ============================================

function handleCurrencyConversion() {
    const fromValue = parseFloat(document.getElementById('from-value-curr').value);
    const toValue = document.getElementById('to-value-curr');
    const resultInfo = document.getElementById('result-info-curr');
    
    // Validate input
    if (isNaN(fromValue) || fromValue === '') {
        toValue.value = '';
        resultInfo.textContent = '';
        resultInfo.classList.remove('success', 'error');
        return;
    }
    
    // Check if amount is negative
    if (fromValue < 0) {
        toValue.value = '';
        resultInfo.textContent = 'Error: Amount cannot be negative';
        resultInfo.classList.add('error');
        resultInfo.classList.remove('success');
        return;
    }
    
    const fromUnit = document.getElementById('from-unit-curr').value;
    const toUnit = document.getElementById('to-unit-curr').value;
    
    // Convert to USD first, then to target currency
    const valueInUSD = fromValue / exchangeRates[fromUnit];
    const result = valueInUSD * exchangeRates[toUnit];
    
    // Determine decimal places
    let decimalPlaces = 2;
    
    // Update result field
    toValue.value = result.toFixed(decimalPlaces);
    
    // Get currency codes and symbols
    const fromCode = fromUnit.toUpperCase();
    const toCode = toUnit.toUpperCase();
    const fromSymbol = currencyDisplayNames[fromUnit];
    const toSymbol = currencyDisplayNames[toUnit];
    
    // Show result info with last update time if available
    let resultText = `${fromSymbol}${fromValue} ${fromCode} = ${toSymbol}${result.toFixed(decimalPlaces)} ${toCode}`;
    if (ratesLastUpdated) {
        resultText += ` (Updated: ${ratesLastUpdated})`;
    }
    
    resultInfo.textContent = resultText;
    resultInfo.classList.add('success');
    resultInfo.classList.remove('error');
}
