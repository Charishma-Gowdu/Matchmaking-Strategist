function RightMatch() {
    let name = document.getElementById('name').value;
    let interests = getCheckboxValues('interests');
    let hobbies = getCheckboxValues('hobbies');
    let senderEmail = document.getElementById('email').value;
    fetch('../json/student.json')
        .then(res => res.json())
        .then(studentData => {
            console.log("Array from JSON file:", studentData);
            const participant = { name, interests, hobbies };
            const maxPossibleMatch = findRightMatch(participant, studentData);
            if (maxPossibleMatch) {
                
                const queryParameters = `?name=${encodeURIComponent(maxPossibleMatch[0].student.Name)}&commonInterests=${encodeURIComponent(maxPossibleMatch[0].commonInterests.join(','))}&commonHobbies=${encodeURIComponent(maxPossibleMatch[0].commonHobbies.join(','))}&percent=${encodeURIComponent(maxPossibleMatch[1])};`
                window.location.href = '../html/match.html' + queryParameters;
                sendEmail(senderEmail,maxPossibleMatch.student.Email);
            }else{
                alert('No Match Found!!');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function sendEmail(senderEmail,receiverEmail){
    Email.send({
        Host: "smtp.gmail.com",
        Username: senderEmail,
        Password: "Enter your password",
        To: receiverEmail,
        From: senderEmail,
        Subject: "Can we catch up for a coffee",
        Body: "I've been feeling a connection between us and I would like to explore it further. Would you be interested in going on a date with me?",
    })
        .then(function (message) {
            alert("mail sent successfully")
        })
        .catch(function (error){
            alert("Error occured while sending email: "+ error);
        });
}

function findRightMatch(participant, students) {
    let maxPossibleMatch = null;
    let maximumCommon = 0;
    students.forEach(student => {
        let commonInterests = participant.interests.filter(interest => student.Interests.includes(interest));
        let commonHobbies = participant.hobbies.filter(hobby => student.Hobbies.includes(hobby));
        console.log("Common Interests for ${student.name}:", commonInterests);
        console.log("Common Hobbies for ${student.name}:", commonHobbies);
        const totalCommon = commonHobbies.length + commonInterests.length;
        if (totalCommon > maximumCommon) {
            maximumCommon = totalCommon;
            maxPossibleMatch = { student, commonInterests, commonHobbies };
        }
    });
    var percent = 0;
    if(maxPossibleMatch){
        var total=participant.hobbies.length+participant.interests.length;
        if(total < maxPossibleMatch.student.Interests.length+maxPossibleMatch.student.Hobbies.length){
            total = maxPossibleMatch.student.Interests.length+maxPossibleMatch.student.Hobbies.length;
        }

        percent=maximumCommon/total*100;

        console.log('match percentage: ', percent);
    }
    

    return [maxPossibleMatch, percent];
}

function getCheckboxValues(name) {
    const checkboxes = document.getElementsByName(name);
    const values = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            values.push(checkbox.value);
        }
    });
    return values;
}
