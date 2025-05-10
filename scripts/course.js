document.addEventListener("DOMContentLoaded", function () {
  
    const courseListContainer = document.querySelector(".course-list");
    const filterButtons = document.querySelectorAll(".filter-btn");
        const creditsTotalSpan = document.getElementById("displayedCreditsTotal");

    // 2. Define your main data: the courses array
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
            technology: ['HTML', 'CSS'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
            technology: ['C#'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        }
    ];


    function displayCourses(coursesToDisplay) {
        if (!courseListContainer) {
            console.error("Error: Course list container (.course-list) not found.");
            return;
        }
        courseListContainer.innerHTML = "";

        if (!Array.isArray(coursesToDisplay) || coursesToDisplay.length === 0) {

            if (creditsTotalSpan) {
                creditsTotalSpan.textContent = "0";
            }
            return;
        }

        coursesToDisplay.forEach(function (course) {
            const listItem = document.createElement('li');
            listItem.classList.add("course-item");
            if (course.completed) {
                listItem.classList.add('completed-course');
            } else {
                listItem.classList.add('current-course');
            }
            listItem.setAttribute('data-category', course.subject.toLowerCase());
            const strongElement = document.createElement('strong');
            strongElement.textContent = course.subject.toUpperCase() + course.number;
            listItem.appendChild(strongElement);
            courseListContainer.appendChild(listItem);
        });
    }

    function updateDisplayedCredits(coursesToDisplay) {
        if (!creditsTotalSpan) {
            console.error("Error: Credits total span (#displayedCreditsTotal) not found.");
            return;
        }
        if (!Array.isArray(coursesToDisplay)) {
            console.error("Error: Cannot calculate credits from non-array.", coursesToDisplay);
            creditsTotalSpan.textContent = "N/A";
            return;
        }

        const totalCredits = coursesToDisplay.reduce(function(totalSoFar, course) {
            return totalSoFar + course.credits;
        }, 0);

        creditsTotalSpan.textContent = totalCredits;
    }

    if (filterButtons && filterButtons.length > 0) {
        filterButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                const filterValue = button.getAttribute("data-filter");

                filterButtons.forEach(function(btn) {
                    btn.classList.remove("active");
                });
                button.classList.add("active");

                let filteredCourses;
                if (filterValue === "all") {
                    filteredCourses = courses;
                } else {
                    filteredCourses = courses.filter(function(course) {
                        return course.subject.toLowerCase() === filterValue;
                    });
                }
                displayCourses(filteredCourses);
                updateDisplayedCredits(filteredCourses); 
            });
        });
    } else {
        console.warn("Warning: No filter buttons found with class '.filter-btn'. Filtering will not work as expected.");
    }

    if (courseListContainer) {
        displayCourses(courses);
        updateDisplayedCredits(courses);
    } else {
        console.error("Error: Course list container (.course-list) not found. Cannot display initial courses.");
    }
});
