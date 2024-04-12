const localize = (key, req, module = null) => {
    if (module) {
        if (module instanceof Object) {
            let replace = new RegExp(Object.keys(module).join("|"), "gi");
            return req.i18n.t(key).replace(replace, function (matched) {
                return module[matched];
            });
        }
        return req.i18n.t(key).replaceAll("{module}", _toTitleCase(module))
    }
    return req.i18n.t(key)
};

const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

module.exports = {
    localize,
    toTitleCase
}