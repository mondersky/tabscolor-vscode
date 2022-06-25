console.log("I am test can you see me?");
    let css = document.createElement('style');
    css.type = 'text/css';

    css.appendChild(document.createTextNode(style));
    document.getElementsByTagName("head")[0].appendChild(css);
addStyle(".monaco-action-bar .action-item .codicon{color:red !important}");