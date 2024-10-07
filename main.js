// Fetch internships from JSON file and display on index.html
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith("index.html")) {
        loadInternships();
    } else if (window.location.pathname.endsWith("company-login.html")) {
        handleCompanyLogin();
    } else if (window.location.pathname.endsWith("company-registration.html")) {
        handleCompanyRegistration();
    } else if (window.location.pathname.endsWith("company-dashboard.html")) {
        loadCompanyDashboard();
    }
});

// Load internships on the index page
function loadInternships() {
    fetch('internships.json')
        .then(response => response.json())
        .then(data => {
            const internshipContainer = document.getElementById('internshipContainer');
            internshipContainer.innerHTML = '';  // Clear previous data
            data.forEach(internship => {
                internshipContainer.innerHTML += createInternshipCard(internship);
            });

            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    showInternshipDetails(data[index]);
                });
            });
        });
}

// Create HTML for each internship card
function createInternshipCard(internship) {
    return `
        <div class="internship-card">
            <h3>${internship.programName}</h3>
            <p><strong>Company:</strong> ${internship.companyName}</p>
            <p><strong>Duration:</strong> ${internship.duration}</p>
            <p><strong>Mode:</strong> ${internship.mode}</p>
            <p><strong>Type:</strong> ${internship.type}</p>
            <button class="view-details-btn" data-index="${internship.index}">View Details</button>
        </div>
    `;
}

// Display internship details in a modal
function showInternshipDetails(internship) {
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalCompanyName').innerText = internship.companyName;
    document.getElementById('modalProgramName').innerText = `Program Name: ${internship.programName}`;
    document.getElementById('modalDuration').innerText = `Duration: ${internship.duration}`;
    document.getElementById('modalStartDate').innerText = `Starting Date: ${internship.startDate}`;
    document.getElementById('modalEndDate').innerText = `Ending Date: ${internship.endDate}`;
    document.getElementById('modalMode').innerText = `Mode: ${internship.mode}`;
    document.getElementById('modalType').innerText = `Type: ${internship.type}`;
    document.getElementById('modalFees').innerText = internship.type === 'Paid' ? `Fees: ${internship.fees}` : 'Free';
    document.getElementById('modalLocation').innerText = `Location: ${internship.location}`;
    document.getElementById('modalMobile').innerText = `Mobile: ${internship.mobile}`;
    document.getElementById('modalEmail').innerText = `Email: ${internship.email}`;
    document.getElementById('modalDescription').innerText = internship.description;

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// Handle "I'm interested" form submission
document.getElementById('interestForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Interest submitted!');
    closeModal();
});

// Handle company login functionality
function handleCompanyLogin() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('dusers.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    window.location.href = 'company-dashboard.html';
                } else {
                    alert('Invalid username or password');
                }
            });
    });
}

// Handle company registration functionality
function handleCompanyRegistration() {
    document.getElementById('registrationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = {
            companyName: document.getElementById('companyName').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        // Fetch existing users, add the new one, and simulate saving it back to JSON
        fetch('users.json')
            .then(response => response.json())
            .then(users => {
                users.push(newUser);
                // In real-world, you'd send this data to the server to update the JSON file.
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful! Please log in.');
                window.location.href = 'company-login.html';
            });
    });
}

// Load company dashboard with all internship programs
function loadCompanyDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'company-login.html';
        return;
    }

    fetch('data/internships.json')
        .then(response => response.json())
        .then(data => {
            const dashboardContainer = document.getElementById('dashboardContainer');
            dashboardContainer.innerHTML = '';  // Clear previous data
            data.forEach((internship, index) => {
                if (internship.companyName === loggedInUser.companyName) {
                    dashboardContainer.innerHTML += createDashboardCard(internship, index);
                }
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    editInternship(data[index]);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    deleteInternship(index);
                });
            });
        });
}

// Create HTML for each internship card in the dashboard
function createDashboardCard(internship, index) {
    return `
        <div class="dashboard-card">
            <h3>${internship.programName}</h3>
            <p><strong>Company:</strong> ${internship.companyName}</p>
            <p><strong>Duration:</strong> ${internship.duration}</p>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
        </div>
    `;
}

// Edit internship (this would be more complex in a real app)
function editInternship(internship) {
    alert(`Editing internship: ${internship.programName}`);
}

// Delete internship (this would remove it from the JSON in a real app)
function deleteInternship(index) {
    alert(`Deleted internship at index: ${index}`);
}
