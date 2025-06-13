export const getLikedItems = () => {
    const liked = localStorage.getItem('likedProducts');
    return liked ? JSON.parse(liked) : [];
};

export const saveLikedItems = (likedArray) => {
    localStorage.setItem('likedProducts', JSON.stringify(likedArray));
};

export function updateFooter() {
    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedParagraph = document.getElementById("lastModified");
    if (lastModifiedParagraph) {
        lastModifiedParagraph.textContent = "Last Updated: " + document.lastModified;
    }
}