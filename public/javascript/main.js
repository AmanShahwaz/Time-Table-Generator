function hideElement(elementId) {
  // Get a reference to the HTML element to hide
  const element = document.getElementById(elementId);

  // Delay the execution of the hiding function by 5 seconds
  setTimeout(() => {
    // Hide the HTML element
    element.style.display = 'hidden';
  }, 2000);
}

hideElement('message');


const printButton = document.getElementById('print-btn');
printButton.addEventListener('click', () => {
  window.print();
});

