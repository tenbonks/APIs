function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function getTableHeaders(obj) {
    var tableHeaders = [];

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`)
    });

    return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, prev) {                                            //This function will create buttons for next set of data and prev set
    if (next && prev) {                                                                     //If there is a value for next and previous
        return `<button onclick="writeToDocument('${prev}')">Previous</button>              
        <button onclick="writeToDocument('${next}')">Next</button>`;                        //return a next and previous button
    } else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`                 //if there is a next set of date, it will return a next button, but not prev
    } else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Next</button>`                 //if there is a prev set of data, it will return a next butto, but not next
    }
}

function writeToDocument(url) {
    var el = document.getElementById("data");
    el.innerHTML = "";

    var pag = document.getElementById("pagination");
    pag.innerHTML = "";

    getData(url, function(data) {

        if (data.next || data.previous) {
            var pagination;
            pagination = generatePaginationButtons(data.next, data.previous)
        }
        var tableRows = [];
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]);

        data.forEach(function(item) {
            var dataRow = [];

            Object.keys(item).forEach(function(key) {
                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 15)
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            tableRows.push(`<tr>${dataRow}</tr>`);
        });

        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>`.replace(/,/g, "");
        pag.innerHTML =`${pagination}`
    });
}