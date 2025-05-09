document.addEventListener('DOMContentLoaded', function() {
//this is for the year
    const yearSpanElement = document.getElementById('currentYear');
    const currentYear = new Date().getFullYear();
    yearSpanElement.textContent = currentYear;
    //this is the last mod date
    const lastModifiedParagraph = document.getElementById('lastModified');
    const docLastModifiedString = document.lastModified;
    lastModifiedParagraph.textContent = docLastModifiedString;
});