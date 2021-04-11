

/** UI */
// GENERATE USER CONTROLS
const generateUserControls = function() {
    
    const inputsDiv = d3.select("#user-input");
    
    var userInputHtml = "";
    for (var i = 0; i<categories.length; i++) {
        userInputHtml += `<div>`;


        userInputHtml += `<label for="${categories[i]}" class="label">`;
        userInputHtml += `${categories[i]} = <span id="${categories[i]}-value">...</span>  %`;
        userInputHtml += `</label>`;

        


        userInputHtml += `</div>`;
    }
    inputsDiv.html(userInputHtml);
}

// CLICK LISTENERS



// MAIN
generateUserControls();
for (var i=0; i<categories.length; i++) {
    d3.select(`#${categories[i]}_plus`).on("click", function() {
        inputListenerPlus(this.id.replace('_plus',''));
    })
    d3.select(`#${categories[i]}_minus`).on("click", function() {
        inputListenerMinus(this.id.replace('_minus',''));
    })
}