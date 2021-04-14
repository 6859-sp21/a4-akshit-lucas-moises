// GENERATE USER CONTROLS
const generateUserControls = function(initialValues) {
    
    const inputsDiv = d3.select("#user-input");
    const btnDiv = d3.select("#user-btn");
    
    var userInputHtml = "";
    for (var i=0; i<categories.length; i++) {
        var categoryName = categories[i];
        userInputHtml += `<div class="categoryInput" id="${categoryName}-div">`;
        userInputHtml += `${categoryName} = `;
        userInputHtml += `</label>`;
        userInputHtml += `<div class="textinput"><input min="0" max="100" type="number" step="5" id="${categoryName}-input" value="${initialValues[categoryName]}"`;
        userInputHtml += `onchange="categoryInputChange('${categoryName}');">%</input></div>`;
        userInputHtml += `</div>`;
    }
    inputsDiv.html(userInputHtml);
}

// TEXTBOX ONCHANGE LISTENER
const categoryInputChange = function(categoryName) {

    // UPDATE PIE CHART
    userInput[categoryName] = +d3.select(`#${categoryName}-input`).node().value;
    if (getUserInputTotal() > 100){
        userInput[categoryName] -= getUserInputTotal() - 100;
        d3.select(`#${categoryName}-input`).property('value', userInput[categoryName])
        alert("Oops! You can't go beyond 100%");
    }
    pieChart.update(getObjValuesAsArray(userInput, categories));

    // UPDATE TOTAL
    d3.select("h3#message").html(`Total = ${getUserInputTotal()}%`);
}

// BUTTON CLICK LISTENER
const btnClick = function() {

    if (getUserInputTotal() != 100) {
        d3.select("h3#message").html(`Sorry, but the total needs to add upto a 100%.<br/>Currently, it's at ${getUserInputTotal()}%.`);
        return;
    }

    pieRadius = vizDivWidth / 8;
    pieInnerRadius = pieRadius * 0.4;
    pieChart.update(getObjValuesAsArray(userInput, categories));

    
    // d3.select(`#Food-div`).append('p').text('yerr')
    for (var i = 0; i<categories.length; i++) {
        d3.select(`#${categories[i]}-div`)
            .append('p')
            .text('vs ')
            .attr('class', 'difference')
            .append("strong")
            .text((getSubTotal(i)/getTotal()*100).toFixed(2)+ '%')
            .attr('class', 'difference')
    }
    

    // SHOW SUNBURST
    SunBurst(consumptionVizData);
    d3.select("button").attr("disabled", true);
    d3.selectAll("input").attr("disabled", true);
}

const getSubTotal = (i) => {

    let sum = 0
    let inner = consumptionVizData['children'][i]
    for (var j= 0; j < inner['children'].length; j++) {
        sum += parseFloat(inner['children'][j]['value'])
    }
    return sum

}

const getTotal = () => {

    let sum = 0
    let inner = consumptionVizData['children']
    for (var i = 0; i < inner.length; i++) {
        let category = inner[i]
        for (var j = 0; j < category['children'].length; j++) {
            sum += parseFloat(category['children'][j]['value'])
        }
    }
    return sum
}

// INPUT VALIDATOR
const getUserInputTotal = function() {
    return getObjValuesAsArray(userInput, categories).reduce((a, b) => { return a + b; }, 0);
}
