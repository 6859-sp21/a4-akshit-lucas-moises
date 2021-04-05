var width = 1000;
var height = 600;

const LeftInterraction = () => {

    that = {}

    // category variables
    that.food = 0
    that.consumables = 0
    that.leisure = 0
    
    that.hide = true

    that.update = () => {
        // adjust the text on the range slider
        d3.select("#food-value").text(that.food);
        d3.select("#food").property("value", that.food);

        d3.select("#consumables-value").text(that.consumables);
        d3.select("#consumables").property("value", that.consumables);

        d3.select("#leisure-value").text(that.leisure);
        d3.select("#leisure").property("value", that.leisure);

        // change message based on sum of values
        if (that.food + that.consumables + that.leisure == 100){
            d3.select("#message").text('Values add to 100% !');
            d3.select("#message").property("value", 'Values add to 100% !');
            if (that.hide) {
                that.showUserVis();
                that.showCountryVis();
                that.hide = false
            }
        }
        else if(that.food + that.consumables + that.leisure > 100){
            d3.select("#message").text('Values are > 100% !');
            d3.select("#message").property("value", 'Values are > 100% !');
        }
        else if(that.food + that.consumables + that.leisure < 100){
            d3.select("#message").text('Values are < 100% !');
            d3.select("#message").property("value", 'Values are < 100% !');
        }

        if (!that.hide) {
            that.updateUserVis();
            that.updateCountryVis();
        }
    }

    that.showUserVis = () => {
        d3.select("#right")
            .append("p")
            .attr("id", 'user-viz')
            .text(`User distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);

    }
    that.updateUserVis = () => {
        d3.select("#user-viz")
            .text(`User distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);
    }

    that.showCountryVis = () => {
        d3.select("#right")
            .append("p")
            .attr("id", 'country-viz')
            .text(`Country distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);

    }

    that.updateCountryVis = () => {
        d3.select("#country-viz")
            .text(`Country distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);
    }

    return that
}

var leftInterraction = LeftInterraction()

// click listeners
d3.select("#food").on("input", function() {
    leftInterraction.food = +this.value
    leftInterraction.update()
});

d3.select("#leisure").on("input", function() {
    leftInterraction.leisure = +this.value
    leftInterraction.update()
});

d3.select("#consumables").on("input", function() {
    leftInterraction.consumables = +this.value
    leftInterraction.update()
});

leftInterraction.update();


