(function searchByFlightCode() {
    const INP_CLASS = '.search-bar__inp';
    const FORM_CLASS = '.search-bar';

    let inp = document.querySelector(INP_CLASS);
    let form = document.querySelector(FORM_CLASS);

    
    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
    });

    // Повесить обработчик после ajax запросов

    setTimeout(function() {
        form.addEventListener('submit', function() {
            let inpVal = inp.value;
            let currTab = document.querySelector('.tab-pane.fade.active.show');
            let currTabRows = Array.from(currTab.children);
            let matchIdxs = searchMatches(currTabRows, inpVal);

            showMatched(currTabRows, matchIdxs);
            inp.value = '';
        })
    }, 4000);

    function showMatched(rows, matches) {
        $(rows).hide();

        rows.forEach((row, rowIdx) => {

            matches.some((matchId) => {

                if (rowIdx === matchId) {

                    $(row).attr('data-id', rowIdx).fadeIn();
                }
            })
            
        })
    }

    function searchMatches(rows, searchVal) {
        let searchIdxs = [];

        rows.forEach((elem, idx) => {
            let codes = elem.querySelectorAll('.num');
            let codesArr = Array.from(codes);

            codesArr.forEach((code) => {
                
                if (checkCode(code.textContent, searchVal)) {
                    searchIdxs.push(idx);
                }
            });
        });

        return searchIdxs;
    }

    function checkCode(code, sCode) {
        let regExp = new RegExp(sCode, 'i') ;
        let result = code.match(regExp);

        return result
            ? true
            : false;
    }
    
})()