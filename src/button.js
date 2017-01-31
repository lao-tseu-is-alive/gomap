const Button = {
    button: '<button id="myButton">Rechercher</button>',
    attachEl: () => {
        document.getElementById('myButton').addEventListener('click', () => {
            // next one allow to stop in debuger in chrome
            //debugger;
            console.log('Clicked myButton', this);
        });
    }
};

export default Button;
