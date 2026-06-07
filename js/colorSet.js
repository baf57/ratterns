// dark/light mode switch function
function darkModeToggle(){
    console.log("toggling dark mode:");
    document.body.classList.toggle("dark-mode");
}

if(window.matchMedia('(prefers-color-scheme: dark)').matches){
    console.log("setting dark mode");
    document.body.classList.add("dark-mode");
}

// if the user switches off the dark scheme then return to light and vice versa
window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', darkModeToggle);