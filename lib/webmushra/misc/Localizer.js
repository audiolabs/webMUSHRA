

function Localizer() {
    /* [lang_code][id] => [string] */
    this.nlsFragments = new Object(); 
}


/**
 * @param _nls_fragments 
 */
Localizer.prototype.initializeNLSFragments = function(_nlsFragments) {    
    this.nlsFragments = _nlsFragments;
};


/**
 * @param _languageCode [ISO 639-1]
 */
Localizer.prototype.addFragment = function(_languageCode, _id, _fragment) {    
    if (!this.nlsFragments[_languageCode]) {
        this.nlsFragments[_languageCode] = new Object();
    }
    this.nlsFragments[_languageCode][_id] = _fragment;
};


Localizer.prototype.getFragment = function(_languageCode, _id) {    
    return this.nlsFragments[_languageCode][_id];
};

/** 
 * Checks whether every string is localized.
 * @return true, if 
 */
Localizer.prototype.checkLocalization = function() {
    var numFragments = null;
    for (var element in this.nlsFragments) {
        if (numFragments == null) {
            numFragments = element.length;
        }
        
        if (numFragments != element.length) {
            return false;
        }        
    }    
    return true;
};