let navbar = `
<nav class="navbar-expand-sm nav_design fixed-top">
    <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" href="kvizek.html">Kvízek</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="kategoriak.html">Kategóriák</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="visszajelzesek.html">Visszajelzések</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="informacio.html">Információ</a>
            </li>


            <li class="nav-item">
                <a class="nav-link nav_kijelentkezes" href="#" id="kijelentkezes">Kijelentkezés</a>
            </li>
        </ul>
    </div>
    </div>
</nav>
`
document.getElementById("navbar_doboz").innerHTML = navbar