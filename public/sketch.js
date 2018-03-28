function setup() {

    noCanvas();

    // Submitting a new word

    // Word from user
    var wordinput = select('#word');

    // Score from user
    var scoreinput = select('#score');

    var scoreit = select('#scoreit');
    
    scoreit.mousePressed(submitscore);

    // Submit the score to the API
    function submitscore() {
        // Make the url
        var url = '/add/' + wordinput.value() + '/' + scoreinput.value();
        // Use loadJSON
        loadJSON(url, submitted);

        function submitted(result) {
            // Just look at the reply in the console
            console.log(result);
        }
    }

    var buttonA = select('#analyze');

    buttonA.mousePressed(analyzeThis);

    function analyzeThis() {
        var txt = select('#textinput').value();
        var data = {
            text: txt
        }
        httpPost('analyze', data, 'json', dataPosted, postError);
    }

    function dataPosted(result) {
        console.log(result);
    }

    function postError(err) {
        console.log(err);
    }

}