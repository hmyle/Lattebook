// Reserved to Borrowing 
document.querySelectorAll('.borrow-button').forEach(button => {
    button.addEventListener('click', function() {
    const transactionId = this.getAttribute('data-id');
    console.log('transactionId:', transactionId);
    
    //  Update the status cell in the row
    const row = this.parentElement.parentElement;
    const statusCell = row.querySelector('td:nth-child(4)'); //  Select the 4th cell in the row
    statusCell.innerText = 'Borrowed';
    
    //  Replace the borrow button with the return button
    const returnButton = `<button id="returnBtn" class="return-button" data-id="${transactionId}">Return</button>`;
    this.parentElement.innerHTML = returnButton;
    
    //  Move the row to the "Borrowing" table
    const borrowingTable = document.querySelector('#borrowing table tbody');
    borrowingTable.appendChild(row);
    
    fetch(`/reservations/borrow`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId: transactionId }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        if (data === 'Transaction was saved') {
        console.log('Successfully borrowed transaction');
        } else {
        console.error('Failed to borrow transaction');
        }
    })
    .catch(error => console.error('Error:', error));
    });
});


// Borrowing to Past reservation 
document.querySelectorAll('.return-button').forEach(button => {
    button.addEventListener('click', function() {
    const transactionId = this.getAttribute('data-id');
    console.log('transactionId:', transactionId);
    
    fetch(`/reservations/return`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: transactionId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
        //  Update the status cell in the row
        const row = this.parentElement.parentElement;
        const statusCell = row.querySelector('td:nth-child(4)'); //  Select the 4th cell in the row
        statusCell.innerText = 'Returned';
        
        //  Remove the return button
        this.parentElement.remove();
        
        //  Move the row to the "Past Reservation" table
        const pastReservationTable = document.querySelector('#pastreservation table tbody');
        pastReservationTable.appendChild(row);
        
        console.log('Successfully returned transaction');
        } else {
        console.error('Failed to return transaction');
        }
    })
    .catch(error => console.error('Error:', error));
    });
});

// Add author popup 
const addauthorinfor = document.querySelector('#addauthorinfor');
const authorNameError = document.querySelector('.authorName.error');
addauthorinfor.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = addauthorinfor.authorName.value;

    try {
        const res = await fetch('/author', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(data);
        if (data.errors) {
            authorNameError.textContent = data.errors.name;
        }
        else {
            authorNameError.textContent = ('Added successfully');
        }
    }
    catch (err) {
        console.log(err);
    }
});

// Add publisher popup 
const addpublisherinfor = document.querySelector('#addpublisherinfor');
const publisherNameError = document.querySelector('.publisherName.error');
addpublisherinfor.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = addpublisherinfor.publisherName.value;

    try{
        const res = await fetch('/publisher', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: { 'Content-Type': 'application/json'}
        });
        const data = await res.json();
        console.log(data);
        if (data.errors){
            publisherNameError.textContent = data.errors.name;
        }
        else{
            publisherNameError.textContent = ('Added successfully');
        }
    }
    catch (err){
        console.log(err);
    }
});

document.querySelectorAll('[id^="addRfidForm-"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('submit');
  
      var rfidString = form.rfidString.value;
      var userId = form.userId.value;

      console.log(rfidString, userId);
  
      try {
        const res = await fetch(`/addRfid/${userId}`, {
          method: 'POST',
          body: JSON.stringify({ rfidString }),
          headers: { 'Content-Type': 'application/json' }
        });
  
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          if (data.errors) {
            form.querySelector('.rfidString.error').textContent = data.errors.name;
          } else {
            form.querySelector('.rfidString.error').textContent = 'Added successfully';
          }
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        console.log(err);
        form.querySelector('.rfidString.error').textContent = 'An error occurred. Please try again.';
      }
    });
  });

// Delete author 
$(document).ready(function() {
    $('.author-remove').click(function(event) {
        event.preventDefault();
        const row = $(this).closest('tr');
        const authorId = $(this).data('id');
        $.ajax({
            url: '/deleteAuthor/' + authorId,
            type: 'POST',
            success: function(response) {
                row.remove();
            }
        });
    });
});


// Delete publisher 
$(document).ready(function() {
    $('.publisher-remove').click(function(event) {
        event.preventDefault();

        const row = $(this).closest('tr');
        const publisherId = $(this).data('id');
        $.ajax({
            url: '/deletePublisher/' + publisherId,
            type: 'POST',
            success: function(response) {
                row.remove();
            }
        });
    });
});

// -------------------------------------- Search --------------------------------------- // 

// Pending Reservation search
document.getElementById('searchInputReservation').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#bookTable tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByClassName('searchableReservation'));
        const cellText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (cellText.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

//  All Borrowing Book search
document.getElementById('searchInputBorrow').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#bookTable tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByClassName('searchableBorrow'));
        const cellText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (cellText.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

//  All Past Reservation search
document.getElementById('searchInputReturn').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#bookTable tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByClassName('searchableReturn'));
        const cellText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (cellText.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

//  All Author search
document.getElementById('searchInputAuthor').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('.styled-table tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByClassName('searchableAuthor'));
        const cellText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (cellText.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

//  All Publisher search
document.getElementById('searchInputPublisher').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('.styled-table tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByClassName('searchablePublisher'));
        const cellText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (cellText.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

//  All Member search
document.getElementById('searchInputMember').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('.styled-table tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByClassName('searchableMember'));
        const cellText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (cellText.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});


//  Get the search icon and form elements
const searchIcon = document.getElementById('search-icon');
const searchForm = document.querySelector('.search-form');

//  Add a click event listener to the search icon
searchIcon.addEventListener('click', function() {
    //  Submit the form when the search icon is clicked
    searchForm.submit();
});
