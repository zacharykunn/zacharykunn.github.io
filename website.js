// Your Firebase configuration - replace with your actual config
var firebaseConfig = {
    apiKey: "AIzaSyC1yNilDoqSO1IdpmdKqsHLFpZJSZdsqIs",
    authDomain: "realtime-database-68d26.firebaseapp.com",
    databaseURL: "https://realtime-database-68d26-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "realtime-database-68d26",
    storageBucket: "realtime-database-68d26.appspot.com",
    messagingSenderId: "229897005962",
    appId: "1:229897005962:web:ced0ea47859ea8eb7a3673"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var chartInstance; // Global variable to hold the chart instance
var timestamps = [];
var humidityData = [];
var temperatureData = [];
var pressureData = [];
// Function to fetch data and plot, with real-time updates
function fetchDataAndPlot() {
    var database = firebase.database();
    var ref = database.ref('/IntegratedSensorData/data_Station1');
    ref.on('value', function(snapshot) {
        var data = snapshot.val();
        

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var dataPoint = data[key];
                // console.log(key);
                // console.log(dataPoint);
                
                if(key=="timestamp"){
                timestamps.push(dataPoint);
                // console.log(timestamps);
                }
                if(key=="pressure_hpa"){
                
                    pressureData.push(dataPoint);
                    // console.log( pressureData);
                }
                if(key=="temperature"){
                
                    temperatureData.push(dataPoint);
                    // console.log(temperatureData);
                }
                if(key=="humidity"){
                
                    humidityData.push(dataPoint);
                    // console.log(humidityData);
                }
            }
        }

        if (chartInstance) {
            chartInstance.destroy(); // Destroy the previous chart instance if it exists
        }

        plotData(timestamps, humidityData, temperatureData, pressureData);
    });
}

function plotData(timestamps, humidityData, temperatureData, pressureData) {
    var ctx = document.getElementById('myChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: 'Humidity (%)',
                borderColor: 'blue',
                data: humidityData,
                fill: false,
            }, {
                label: 'Temperature (°C)',
                borderColor: 'red',
                data: temperatureData,
                fill: false,
            }, {
                label: 'Pressure (hPa) *10',
                borderColor: 'green',
                data: pressureData,
                fill: false,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'MM/DD/YYYY HH:mm',
                        tooltipFormat: 'll HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

// Call fetchDataAndPlot when the window loads
window.onload = function() {
    fetchDataAndPlot();
};