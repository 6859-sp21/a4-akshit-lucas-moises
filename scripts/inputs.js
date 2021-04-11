// GENERATE USER CONTROLS
const generateUserControls = function(initialValues) {
    
    const inputsDiv = d3.select("#user-input");
    
    var userInputHtml = "";
    for (var i=0; i<categories.length; i++) {
        var categoryName = categories[i];
        userInputHtml += `<div class="categoryInput">`;
        userInputHtml += `${categoryName} = `;
        userInputHtml += `</label>`;
        userInputHtml += `<input type="number" step="5" id="${categoryName}-input" value="${initialValues[categoryName]}"`;
        userInputHtml += `onchange="categoryInputChange('${categoryName}');">%</input>`;
        userInputHtml += `</div>`;
    }

    // ADD SUBMIT BUTTON
    userInputHtml += "<button onclick='btnClick()'>Click to find reality!</button>";

    inputsDiv.html(userInputHtml);
}

// TEXTBOX ONCHANGE LISTENER
const categoryInputChange = function(categoryName) {

    // UPDATE PIE CHART
    userInput[categoryName] = +d3.select(`#${categoryName}-input`).node().value;
    pieChart.update(getObjValuesAsArray(userInput, categories));
}

// BUTTON CLICK LISTENER
const btnClick = function() {

    // SHOW SUNBURST
    SunBurst(consumptionVizData);
    d3.select("button").attr("disabled", true);
    d3.selectAll("input").attr("disabled", true);
}
