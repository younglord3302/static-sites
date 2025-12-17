// Mock job data
const jobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco",
        type: "full-time",
        experience: "senior",
        salary: 150000,
        salaryRange: "150000+",
        industry: "technology",
        postedDate: "2025-01-15",
        description: "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.",
        requirements: ["5+ years of React experience", "TypeScript proficiency", "CSS/SCSS expertise", "Team leadership experience"],
        benefits: ["Competitive salary", "Health insurance", "Flexible work hours", "Professional development budget"]
    },
    {
        id: 2,
        title: "Product Manager",
        company: "StartupXYZ",
        location: "remote",
        type: "full-time",
        experience: "mid",
        salary: 120000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2025-01-14",
        description: "Join our fast-growing startup as a Product Manager. You'll work closely with engineering, design, and business teams to define and deliver innovative products.",
        requirements: ["3+ years of product management experience", "Strong analytical skills", "Excellent communication", "Technical background preferred"],
        benefits: ["Equity package", "Remote work", "Learning stipend", "Health benefits"]
    },
    {
        id: 3,
        title: "Data Scientist",
        company: "DataTech Solutions",
        location: "New York",
        type: "full-time",
        experience: "mid",
        salary: 130000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2025-01-13",
        description: "We're seeking a Data Scientist to analyze complex datasets and build predictive models. You'll work with large-scale data to drive business insights.",
        requirements: ["MS/PhD in relevant field", "Python/R programming", "Machine learning experience", "SQL proficiency"],
        benefits: ["Research time", "Conference attendance", "Top-tier health insurance", "Flexible PTO"]
    },
    {
        id: 4,
        title: "UX Designer",
        company: "Design Studio",
        location: "London",
        type: "contract",
        experience: "mid",
        salary: 80000,
        salaryRange: "50000-100000",
        industry: "technology",
        postedDate: "2025-01-12",
        description: "Looking for a talented UX Designer to create intuitive user experiences for our mobile and web applications. You'll conduct user research and design user flows.",
        requirements: ["3+ years UX design experience", "Figma/Sketch proficiency", "User research skills", "Portfolio required"],
        benefits: ["Creative freedom", "Flexible hours", "Design tools budget", "Collaborative team"]
    },
    {
        id: 5,
        title: "DevOps Engineer",
        company: "CloudTech",
        location: "Toronto",
        type: "full-time",
        experience: "senior",
        salary: 140000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2025-01-11",
        description: "Join our DevOps team to build and maintain scalable infrastructure. You'll work with Kubernetes, AWS, and CI/CD pipelines.",
        requirements: ["5+ years DevOps experience", "Kubernetes expertise", "AWS certification", "Scripting skills"],
        benefits: ["Cloud certification reimbursement", "Remote work options", "Learning budget", "Health benefits"]
    },
    {
        id: 6,
        title: "Marketing Manager",
        company: "BrandCo",
        location: "New York",
        type: "full-time",
        experience: "mid",
        salary: 95000,
        salaryRange: "50000-100000",
        industry: "retail",
        postedDate: "2025-01-10",
        description: "Lead marketing campaigns for our consumer products. You'll manage digital marketing, content creation, and brand strategy.",
        requirements: ["3+ years marketing experience", "Digital marketing expertise", "Analytics skills", "Creative thinking"],
        benefits: ["Performance bonuses", "Professional development", "Health insurance", "Flexible work"]
    },
    {
        id: 7,
        title: "Software Engineer Intern",
        company: "BigTech Corp",
        location: "San Francisco",
        type: "part-time",
        experience: "entry",
        salary: 30000,
        salaryRange: "0-50000",
        industry: "technology",
        postedDate: "2025-01-09",
        description: "Summer internship opportunity for computer science students. Work on real projects with mentorship from senior engineers.",
        requirements: ["Currently enrolled in CS program", "Basic programming skills", "Git knowledge", "Learning mindset"],
        benefits: ["Mentorship program", "Housing stipend", "Networking opportunities", "Potential full-time offer"]
    },
    {
        id: 8,
        title: "Financial Analyst",
        company: "FinancePlus",
        location: "London",
        type: "full-time",
        experience: "entry",
        salary: 60000,
        salaryRange: "50000-100000",
        industry: "finance",
        postedDate: "2025-01-08",
        description: "Entry-level position analyzing financial data and creating reports. Great opportunity to learn from experienced analysts.",
        requirements: ["Bachelor's in Finance/Economics", "Excel proficiency", "Basic SQL knowledge", "Attention to detail"],
        benefits: ["Training programs", "Career progression", "Health benefits", "Pension scheme"]
    },
    {
        id: 9,
        title: "Registered Nurse",
        company: "City Hospital",
        location: "Toronto",
        type: "full-time",
        experience: "mid",
        salary: 75000,
        salaryRange: "50000-100000",
        industry: "healthcare",
        postedDate: "2025-01-07",
        description: "Provide patient care in our busy hospital ward. Work with multidisciplinary teams to deliver excellent healthcare services.",
        requirements: ["RN license", "2+ years experience", "BLS certification", "Strong communication skills"],
        benefits: ["Competitive salary", "Health benefits", "Pension plan", "Professional development"]
    },
    {
        id: 10,
        title: "Professor of Computer Science",
        company: "Tech University",
        location: "San Francisco",
        type: "full-time",
        experience: "executive",
        salary: 120000,
        salaryRange: "100000-150000",
        industry: "education",
        postedDate: "2025-01-06",
        description: "Tenure-track position teaching computer science courses and conducting research. Join our world-class faculty.",
        requirements: ["PhD in Computer Science", "Teaching experience", "Research publications", "Industry connections"],
        benefits: ["Tenure track", "Research funding", "Sabbatical opportunities", "Excellent benefits package"]
    },
    {
        id: 11,
        title: "Full Stack Developer",
        company: "WebSolutions Inc",
        location: "remote",
        type: "contract",
        experience: "mid",
        salary: 90000,
        salaryRange: "50000-100000",
        industry: "technology",
        postedDate: "2025-01-05",
        description: "Build end-to-end web applications using modern technologies. Work remotely with a distributed team.",
        requirements: ["React and Node.js experience", "Database knowledge", "API development", "Git proficiency"],
        benefits: ["Remote work", "Flexible hours", "Project-based work", "High hourly rate"]
    },
    {
        id: 12,
        title: "Data Analyst",
        company: "Analytics Corp",
        location: "New York",
        type: "full-time",
        experience: "entry",
        salary: 65000,
        salaryRange: "50000-100000",
        industry: "technology",
        postedDate: "2025-01-04",
        description: "Analyze business data to provide insights and recommendations. Create dashboards and reports for stakeholders.",
        requirements: ["SQL and Excel skills", "Basic statistics knowledge", "Tableau/Power BI", "Communication skills"],
        benefits: ["Training opportunities", "Career growth", "Health benefits", "Flexible work options"]
    },
    {
        id: 13,
        title: "Graphic Designer",
        company: "Creative Agency",
        location: "London",
        type: "full-time",
        experience: "mid",
        salary: 55000,
        salaryRange: "50000-100000",
        industry: "retail",
        postedDate: "2025-01-03",
        description: "Create visual content for clients across various media. Work on branding, marketing materials, and digital designs.",
        requirements: ["Adobe Creative Suite proficiency", "3+ years design experience", "Portfolio required", "Typography skills"],
        benefits: ["Creative projects", "Client exposure", "Professional development", "Flexible work environment"]
    },
    {
        id: 14,
        title: "Backend Developer",
        company: "API Solutions",
        location: "remote",
        type: "full-time",
        experience: "senior",
        salary: 135000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2025-01-02",
        description: "Build scalable backend services and APIs. Work with microservices architecture and cloud technologies.",
        requirements: ["5+ years backend development", "Microservices experience", "Cloud platforms (AWS/Azure)", "API design"],
        benefits: ["Remote work", "Technology choices", "Conference budget", "Health benefits"]
    },
    {
        id: 15,
        title: "Sales Representative",
        company: "TechSales Pro",
        location: "Toronto",
        type: "full-time",
        experience: "mid",
        salary: 70000,
        salaryRange: "50000-100000",
        industry: "technology",
        postedDate: "2025-01-01",
        description: "Sell enterprise software solutions to businesses. Build relationships and close deals with B2B clients.",
        requirements: ["Sales experience", "CRM software knowledge", "Communication skills", "Goal-oriented"],
        benefits: ["Commission structure", "Sales training", "Travel opportunities", "Health benefits"]
    },
    {
        id: 16,
        title: "Mobile App Developer",
        company: "AppDev Studio",
        location: "San Francisco",
        type: "contract",
        experience: "senior",
        salary: 110000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2024-12-31",
        description: "Develop native mobile applications for iOS and Android. Work on cutting-edge mobile technologies.",
        requirements: ["React Native/Flutter experience", "Native development", "App store deployment", "UI/UX understanding"],
        benefits: ["Latest devices", "Flexible contracts", "Portfolio building", "High rates"]
    },
    {
        id: 17,
        title: "Content Writer",
        company: "ContentCo",
        location: "remote",
        type: "part-time",
        experience: "mid",
        salary: 40000,
        salaryRange: "0-50000",
        industry: "retail",
        postedDate: "2024-12-30",
        description: "Create engaging content for blogs, websites, and social media. Research and write about various topics.",
        requirements: ["Writing experience", "SEO knowledge", "Research skills", "Creative thinking"],
        benefits: ["Remote work", "Flexible schedule", "Creative freedom", "Portfolio development"]
    },
    {
        id: 18,
        title: "Network Engineer",
        company: "NetTech Solutions",
        location: "New York",
        type: "full-time",
        experience: "senior",
        salary: 125000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2024-12-29",
        description: "Design and maintain enterprise network infrastructure. Work with Cisco, Juniper, and cloud networking.",
        requirements: ["CCNP/CCIE certification", "5+ years networking", "Cloud networking", "Security knowledge"],
        benefits: ["Certification reimbursement", "Advanced training", "Health benefits", "Stability"]
    },
    {
        id: 19,
        title: "HR Manager",
        company: "PeopleFirst Corp",
        location: "London",
        type: "full-time",
        experience: "senior",
        salary: 85000,
        salaryRange: "50000-100000",
        industry: "retail",
        postedDate: "2024-12-28",
        description: "Manage human resources functions including recruitment, employee relations, and HR policies.",
        requirements: ["5+ years HR experience", "Recruitment expertise", "HR certifications", "Leadership skills"],
        benefits: ["Work-life balance", "Professional development", "Health benefits", "Team building"]
    },
    {
        id: 20,
        title: "QA Engineer",
        company: "QualitySoft",
        location: "Toronto",
        type: "full-time",
        experience: "mid",
        salary: 80000,
        salaryRange: "50000-100000",
        industry: "technology",
        postedDate: "2024-12-27",
        description: "Ensure software quality through comprehensive testing. Write test cases, automate tests, and report bugs.",
        requirements: ["3+ years QA experience", "Test automation", "Bug tracking tools", "SQL knowledge"],
        benefits: ["Quality-focused culture", "Testing tools", "Professional growth", "Health benefits"]
    },
    {
        id: 21,
        title: "Project Manager",
        company: "PM Solutions",
        location: "remote",
        type: "full-time",
        experience: "senior",
        salary: 105000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2024-12-26",
        description: "Lead software development projects from inception to delivery. Coordinate teams and manage timelines.",
        requirements: ["PMP certification", "5+ years PM experience", "Agile/Scrum knowledge", "Technical background"],
        benefits: ["Remote work", "Project bonuses", "Leadership training", "Health benefits"]
    },
    {
        id: 22,
        title: "Database Administrator",
        company: "DataGuard Inc",
        location: "San Francisco",
        type: "full-time",
        experience: "senior",
        salary: 115000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2024-12-25",
        description: "Manage and optimize database systems. Ensure data integrity, performance, and security.",
        requirements: ["5+ years DBA experience", "SQL Server/PostgreSQL", "Performance tuning", "Backup/recovery"],
        benefits: ["Database training", "Certification support", "Health benefits", "Stable environment"]
    },
    {
        id: 23,
        title: "Customer Success Manager",
        company: "SuccessCo",
        location: "New York",
        type: "full-time",
        experience: "mid",
        salary: 78000,
        salaryRange: "50000-100000",
        industry: "technology",
        postedDate: "2024-12-24",
        description: "Ensure customer satisfaction and retention. Work with clients to maximize product value.",
        requirements: ["3+ years customer success", "CRM software", "Communication skills", "Problem-solving"],
        benefits: ["Customer interaction", "Commission potential", "Professional development", "Health benefits"]
    },
    {
        id: 24,
        title: "Security Engineer",
        company: "SecureTech",
        location: "London",
        type: "full-time",
        experience: "senior",
        salary: 140000,
        salaryRange: "100000-150000",
        industry: "technology",
        postedDate: "2024-12-23",
        description: "Implement and maintain security measures. Conduct security assessments and respond to incidents.",
        requirements: ["5+ years security experience", "Security certifications", "Incident response", "Risk assessment"],
        benefits: ["Security training", "Certifications paid", "Health benefits", "Critical role"]
    },
    {
        id: 25,
        title: "Business Analyst",
        company: "BizAnalyst Pro",
        location: "Toronto",
        type: "contract",
        experience: "mid",
        salary: 85000,
        salaryRange: "50000-100000",
        industry: "finance",
        postedDate: "2024-12-22",
        description: "Analyze business processes and requirements. Create documentation and recommend improvements.",
        requirements: ["3+ years BA experience", "Requirements gathering", "Process modeling", "Communication skills"],
        benefits: ["Varied projects", "Flexible contracts", "Professional network", "Skill development"]
    }
];

// Global variables
let currentPage = 1;
let itemsPerPage = 10;
let filteredJobs = [...jobs];
let currentFilters = {};
let currentSort = 'relevance';

// DOM elements
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const jobListings = document.getElementById('jobListings');
const pagination = document.getElementById('pagination');
const resultsCount = document.getElementById('resultsCount');
const clearFiltersBtn = document.getElementById('clearFilters');
const jobModal = document.getElementById('jobModal');
const closeModal = document.getElementById('closeModal');

// Initialize the application
function init() {
    renderJobs();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Sort select
    sortSelect.addEventListener('change', handleSort);

    // Items per page
    itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);

    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Clear filters
    clearFiltersBtn.addEventListener('click', clearAllFilters);

    // Navigation links
    setupNavigation();

    // Company "View Jobs" buttons
    setupCompanyButtons();

    // Modal close
    closeModal.addEventListener('click', () => {
        jobModal.classList.add('hidden');
    });

    // Close modal on outside click
    jobModal.addEventListener('click', (e) => {
        if (e.target === jobModal) {
            jobModal.classList.add('hidden');
        }
    });
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('header a');
    const sections = {
        'Home': 'homeSection',
        'Companies': 'companiesSection',
        'About': 'aboutSection'
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.textContent.trim();
            showSection(sections[sectionName]);
        });
    });
}

// Show specific section
function showSection(sectionId, filterCompany = null) {
    // Hide all sections
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('companiesSection').classList.add('hidden');
    document.getElementById('aboutSection').classList.add('hidden');

    // Show selected section
    if (sectionId === 'homeSection') {
        document.getElementById('homeSection').style.display = 'block';
        // Clear any company filter when showing home
        currentFilters = {};
        searchInput.value = '';
        applyFiltersAndSearch();
    } else {
        document.getElementById(sectionId).classList.remove('hidden');
    }

    // If filtering by company, apply the filter
    if (filterCompany && sectionId === 'homeSection') {
        searchInput.value = filterCompany;
        applyFiltersAndSearch();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFiltersAndSearch();
}

// Handle sort
function handleSort() {
    currentSort = sortSelect.value;
    sortJobs();
    renderJobs();
}

// Handle items per page change
function handleItemsPerPageChange() {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1;
    renderJobs();
}

// Handle filter change
function handleFilterChange(e) {
    const headingText = e.target.closest('div').querySelector('h4').textContent.toLowerCase();

    // Map filter headings to job object properties
    let filterType;
    switch (headingText) {
        case 'job type':
            filterType = 'type';
            break;
        case 'experience level':
            filterType = 'experience';
            break;
        case 'salary range':
            filterType = 'salaryRange';
            break;
        case 'location':
            filterType = 'location';
            break;
        case 'industry':
            filterType = 'industry';
            break;
        default:
            return;
    }

    const filterValue = e.target.value;

    if (!currentFilters[filterType]) {
        currentFilters[filterType] = new Set();
    }

    if (e.target.checked) {
        currentFilters[filterType].add(filterValue);
    } else {
        currentFilters[filterType].delete(filterValue);
        if (currentFilters[filterType].size === 0) {
            delete currentFilters[filterType];
        }
    }

    applyFiltersAndSearch();
}

// Apply filters and search
function applyFiltersAndSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredJobs = jobs.filter(job => {
        // Search filter
        if (searchTerm) {
            const searchText = `${job.title} ${job.company} ${job.description} ${job.requirements.join(' ')}`.toLowerCase();
            if (!searchText.includes(searchTerm)) {
                return false;
            }
        }

        // Apply filters
        for (const [filterType, filterValues] of Object.entries(currentFilters)) {
            if (filterValues.size > 0) {
                const jobValue = job[filterType];
                if (!filterValues.has(jobValue)) {
                    return false;
                }
            }
        }

        return true;
    });

    sortJobs();
    currentPage = 1;
    renderJobs();
}

// Sort jobs
function sortJobs() {
    filteredJobs.sort((a, b) => {
        switch (currentSort) {
            case 'date':
                return new Date(b.postedDate) - new Date(a.postedDate);
            case 'salary-high':
                return b.salary - a.salary;
            case 'salary-low':
                return a.salary - b.salary;
            case 'relevance':
            default:
                return b.id - a.id; // Default to newest first
        }
    });
}

// Clear all filters
function clearAllFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    currentFilters = {};
    searchInput.value = '';
    applyFiltersAndSearch();
}

// Render jobs
function renderJobs() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);

    jobListings.innerHTML = '';

    if (jobsToShow.length === 0) {
        jobListings.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p class="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
        `;
    } else {
        jobsToShow.forEach(job => {
            const jobCard = createJobCard(job);
            jobListings.appendChild(jobCard);
        });
    }

    updateResultsCount();
    renderPagination();
}

// Create job card
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer';
    card.onclick = () => openJobModal(job);

    const postedDate = new Date(job.postedDate);
    const daysAgo = Math.floor((new Date() - postedDate) / (1000 * 60 * 60 * 24));

    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${job.title}</h3>
                <p class="text-gray-600 mb-2">${job.company}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
                    <span><i class="fas fa-clock mr-1"></i>${job.type.replace('-', ' ')}</span>
                    <span><i class="fas fa-dollar-sign mr-1"></i>${job.salary.toLocaleString()}</span>
                </div>
            </div>
            <div class="text-right">
                <span class="text-sm text-gray-500">${daysAgo} days ago</span>
            </div>
        </div>
        <p class="text-gray-700 mb-4 line-clamp-2">${job.description}</p>
        <div class="flex flex-wrap gap-2">
            ${job.requirements.slice(0, 3).map(req => `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${req}</span>`).join('')}
            ${job.requirements.length > 3 ? `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">+${job.requirements.length - 3} more</span>` : ''}
        </div>
    `;

    return card;
}

// Update results count
function updateResultsCount() {
    const totalJobs = filteredJobs.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalJobs);

    if (totalJobs === 0) {
        resultsCount.textContent = 'No jobs found';
    } else {
        resultsCount.textContent = `Showing ${start}-${end} of ${totalJobs} jobs`;
    }
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    if (currentPage > 1) {
        const prevBtn = createPaginationButton('Previous', currentPage - 1);
        pagination.appendChild(prevBtn);
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPaginationButton(i.toString(), i);
        if (i === currentPage) {
            pageBtn.classList.add('bg-blue-600', 'text-white');
        }
        pagination.appendChild(pageBtn);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextBtn = createPaginationButton('Next', currentPage + 1);
        pagination.appendChild(nextBtn);
    }
}

// Create pagination button
function createPaginationButton(text, page) {
    const button = document.createElement('button');
    button.className = 'px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors';
    button.textContent = text;
    button.onclick = () => {
        currentPage = page;
        renderJobs();
    };
    return button;
}

// Open job modal
function openJobModal(job) {
    document.getElementById('modalJobTitle').textContent = job.title;
    document.getElementById('modalCompany').textContent = job.company;
    document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt mr-1"></i>${job.location}`;
    document.getElementById('modalType').innerHTML = `<i class="fas fa-clock mr-1"></i>${job.type.replace('-', ' ')}`;
    document.getElementById('modalSalary').innerHTML = `<i class="fas fa-dollar-sign mr-1"></i>$${job.salary.toLocaleString()}`;
    document.getElementById('modalDescription').textContent = job.description;

    const requirementsList = document.getElementById('modalRequirements');
    requirementsList.innerHTML = '';
    job.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        requirementsList.appendChild(li);
    });

    const benefitsList = document.getElementById('modalBenefits');
    benefitsList.innerHTML = '';
    job.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });

    jobModal.classList.remove('hidden');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Setup company buttons
function setupCompanyButtons() {
    // Use event delegation for company buttons since they might not exist initially
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('company-view-jobs-btn')) {
            e.preventDefault();
            const companyName = e.target.getAttribute('data-company');
            showSection('homeSection', companyName);
        }
    });
}

// Initialize the app
init();
