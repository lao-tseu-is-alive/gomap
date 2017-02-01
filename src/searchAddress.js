import * as U from './htmlUtils';
const searchAddress = {
    searchAddress: `
        <div class="three columns"><input type="search" id="searchAdd"></div>
        <div class="three columns"><button id="myButton" class="button-primary">Rechercher</button></div>
        
`,
    attachEl: () => {
        U.getEl('myButton').addEventListener('click', () => {
            // next one allow to stop in debuger in chrome
            //debugger;
            const search = U.getEl('searchAdd');

            console.log('Your search is about : ', search.value);
        });
    }
};

export default searchAddress;
