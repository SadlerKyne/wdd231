document.addEventListener('DOMContentLoaded', function() {
    const formDataDisplay = document.getElementById('formDataDisplay');
    if (!formDataDisplay) {
        console.error("formDataDisplay element not found.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    let outputHtml = '<ul>';
    let dataFound = false;

    const fieldLabels = {
        fname: "First Name",
        lname: "Last Name",
        email: "Email Address",
        phone: "Mobile Phone Number",
        orgname: "Business/Organization's Name",
        timestamp: "Application Timestamp"
    };

    for (const key in fieldLabels) {
        if (params.has(key)) {
            let value = params.get(key);
            if (key === "timestamp") {
                const date = new Date(value);
                value = date.toLocaleString();
            }
            outputHtml += `<li><strong>${fieldLabels[key]}:</strong> ${escapeHTML(value)}</li>`;
            dataFound = true;
        }
    }


    if (dataFound) {
        outputHtml += '</ul>';
        formDataDisplay.innerHTML = outputHtml;
    } else {
        formDataDisplay.innerHTML = '<p>No application data was submitted or found.</p>';
    }
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );
}