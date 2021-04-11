// GLOBAL VARIABLES
const pieChartDimensions = {
    width: 450,     //px
    height: 450     //px
};
const pieRadius = 100;  //px

// GENERATE USER CONTROLS
const generateUserControls = function() {
    
    const inputsDiv = d3.select("#user-input");
    
    var userInputHtml = "";
    for (var i=0; i<categories.length; i++) {
        userInputHtml += `<div>`;
        userInputHtml += `<label for="${categories[i]}" class="label">`;
        userInputHtml += `${categories[i]} = <span id="${categories[i]}-value">...</span>  %`;
        userInputHtml += `</label>`;
        userInputHtml += `<input type="range" min="0" max="100" id="${categories[i]}">`;
        userInputHtml += `</div>`;
    }
    inputsDiv.html(userInputHtml);
}

// CLICK LISTENER
const sliderInputListener = function(categoryName, value) {
    pieChart.data[categories.indexOf(categoryName)] = value;
    pieChart.update();
}

// LEFT INTERCTION
const LeftInterraction = () => {

    var that = {}
    
    // DATA MEMBERS
    that.hide = true;
    that.data = {};
    for (var i=0; i<categories.length; i++) {
        that.data[categories[i]] = 0;
    }

    // FUNCTIONS
    that._updateSliderText = function(labelId, sliderId, value) {
        d3.select(`#${labelId}`).text(value);
        d3.select(`#${sliderId}`).property("value", value);
    };

    that.update = () => {

        // adjust the text on the range slider, and
        // sum all values
        var sum = 0;
        for (var i=0; i<categories.length; i++) {
            that._updateSliderText(`${categories[i]}-value`, `${categories[i]}`, that.data[categories[i]]);
            sum += that.data[categories[i]];
        }

        // change message based on sum of values
        d3.select("#message").text(`Total Allocation = ${sum}%`);

        // Show/hide Visualization(s)
        if (sum == 100){
            that.hide = false;
            for (var i=0; i<categories.length; i++) {
                d3.select(`#${categories[i]}`).attr("disabled", true);
            }
        } else {
            that.hide = true;
        }

        
        if(!that.hide) {
            // showVis('user-viz', that.getUserData());
            showVis('country-viz', consumptionVizData);
            d3.select('.smiley').style('display', 'block');
        }
    }

    that.getUserData = () => {

        var dataObj = getEmptyDataObj();
        for (var i=0; i<dataObj.children.length; i++) {
            
            var categoryName = dataObj.children[i].name;
            dataObj.children[i].value = that.data[categoryName];
        }
        return dataObj;
    }

    return that;
}
