-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Gép: 192.168.255.103
-- Létrehozás ideje: 2025. Már 20. 10:07
-- Kiszolgáló verziója: 11.4.2-MariaDB-log
-- PHP verzió: 8.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kvizjatek`
--
CREATE DATABASE IF NOT EXISTS `kvizjatek` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `kvizjatek`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertekelesek`
--

CREATE TABLE `ertekelesek` (
  `ertekeles_id` int(11) NOT NULL,
  `ertekeles_felhasznalo` varchar(255) NOT NULL,
  `ertekeles_kviz` int(11) NOT NULL,
  `ertekeles_pont` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `ertekelesek`
--

INSERT INTO `ertekelesek` (`ertekeles_id`, `ertekeles_felhasznalo`, `ertekeles_kviz`, `ertekeles_pont`) VALUES
(1, 'benjamin@gmail.com', 30, 1),
(2, 'anna@gmail.com', 30, -1),
(3, 'tamas@gmail.com', 30, 1),
(4, 'gergo@gmail.com', 30, 1),
(5, 'Admin', 27, 0),
(6, 'Admin', 2, 0),
(7, 'Admin', 26, 0),
(8, 'Admin', 28, 0),
(9, 'Admin', 29, 0),
(10, 'Admin', 30, 0),
(11, 'Admin', 31, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `felhasznalo_email` varchar(255) NOT NULL,
  `felhasznalo_nev` varchar(20) NOT NULL,
  `felhasznalo_jelszo` varchar(64) NOT NULL,
  `felhasznalo_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`felhasznalo_email`, `felhasznalo_nev`, `felhasznalo_jelszo`, `felhasznalo_admin`) VALUES
('Admin', 'Admin', '$2b$10$FdF/JVtzKNA621cWmkDCw.Nq1Iw4fdN7nP7S.nrsMNkE.rKGus0Oy', 1),
('anna@gmail.com', 'Anna', '$2b$10$UOCSp.eWNrCiAxdv3suP8O0qT/LvOXZ/Y62cxNp/gA7FQyAmlBgKi', 0),
('benjamin@gmail.com', 'Benjámin', '$2b$10$6Z9hzPjmrn5Yh3MeaR6zDuj.nw753wZFhbMlP7yur0NjOj7JqTIm.', 0),
('daniel@gmail.com', 'Dániel', '$2b$10$cKjzZbJ.aJBqNYJ.GNhse.LmHrVXSouzgqkLwM/KQWhGA/LNZJcSG', 0),
('emese@gmail.com', 'Emese', '$2b$10$.fPrb.cSuQ/mSuKhKsJ0u.oxrCqA0EJhEdZo1Ek7wQ7rIZYHhTFwO', 0),
('gergo@gmail.com', 'Gergő', '$2b$10$/sjtxAfzjh6yJ7Z0Hed7nOYAM386C3b7bEQ0Esk7Kh7bq1NMDjrGK', 0),
('tamas@gmail.com', 'Tamás', '$2b$10$04Anf/G3Ha4vKsu904Dhee0ID5FBz420v99rboDXFd/XvFfCLF8iK', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `kategoria_id` int(11) NOT NULL,
  `kategoria_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`kategoria_id`, `kategoria_nev`) VALUES
(1, 'Egyéb'),
(2, 'Történelem'),
(3, 'Természet'),
(4, 'Irodalom'),
(5, 'Sport'),
(6, 'Tudomány'),
(7, 'Filmek'),
(8, 'Földrajz'),
(9, 'Gasztronómia'),
(10, 'Zene'),
(11, 'Művészet'),
(12, 'Technológia'),
(13, 'Kultúra'),
(14, 'Állatok'),
(15, 'Játékok'),
(16, 'Anime'),
(17, 'Rajzfilmek'),
(19, 'Képregények');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kerdesek`
--

CREATE TABLE `kerdesek` (
  `kerdes_id` int(11) NOT NULL,
  `kerdes_kviz` int(11) NOT NULL,
  `kerdes` varchar(255) NOT NULL,
  `valasz_jo` varchar(50) NOT NULL,
  `valasz_rossz1` varchar(50) NOT NULL,
  `valasz_rossz2` varchar(50) NOT NULL,
  `valasz_rossz3` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `kerdesek`
--

INSERT INTO `kerdesek` (`kerdes_id`, `kerdes_kviz`, `kerdes`, `valasz_jo`, `valasz_rossz1`, `valasz_rossz2`, `valasz_rossz3`) VALUES
(34, 26, 'Ki Garfield legjobb barátja?', 'Odie', 'Nermal', 'Liz', 'Arlene'),
(35, 26, 'Mi Garfield kedvenc étele?', 'Lasagne', 'Pizza', 'Hamburger', 'Spagetti'),
(36, 26, 'Milyen állat Garfield?', 'Macska', 'Kutya', 'Nyúl', 'Egér'),
(37, 26, 'Mi Garfield legnagyobb ellensége?', 'Diéta', 'Postás', 'Egerek', 'Adóbevallás'),
(38, 26, 'Melyik napot utálja Garfield a legjobban?', 'Hétfő', 'Kedd', 'Péntek', 'Vasárnap'),
(39, 26, 'Ki Garfield gazdája?', 'Jon Arbuckle', 'Liz Wilson', 'Roy Rooster', 'Irma'),
(40, 26, 'Mi Garfield plüssmackójának a neve?', 'Pooky', 'Teddy', 'Grizzly', 'Chuck Norris'),
(41, 26, 'Hogy hívják Garfield \"riválisát\", a cuki, szürke macskát?', 'Nermal', 'Pooky', 'Irma', 'Scooby-Doo'),
(42, 2, 'Melyik évben történt az amerikai függetlenségi nyilatkozat aláírása?', '1776', '1789', '1804', '1812'),
(43, 2, 'Ki volt az első római császár?', 'Augustus', 'Julius Caesar', 'Nero', 'Traianus'),
(44, 2, 'Melyik csata volt a napóleoni háborúk döntő ütközete?', 'Waterloo', 'Austerlitz', 'Borogyinó', 'Trafalgar'),
(45, 2, 'Melyik évben ért véget az I. világháború?', '1918', '1914', '1923', '1939'),
(46, 2, 'Ki volt az az ókori görög hadvezér, aki meghódította Perzsiát?', 'Alexandrosz (Nagy Sándor)', 'Periklész', 'Leonidász', 'Miltiadész'),
(47, 2, 'Melyik országban tört ki a reformáció 1517-ben?', 'Német-római Birodalom', 'Anglia', 'Franciaország', 'Spanyolország'),
(48, 2, 'Ki volt a Szovjetunió vezetője a II. világháború alatt?', 'Sztálin', 'Lenin', 'Hruscsov', 'Brezsnyev'),
(49, 2, 'Melyik világbirodalom fővárosa volt Konstantinápoly?', 'Bizánci Birodalom', 'Oszmán Birodalom', 'Római Birodalom', 'Frank Birodalom'),
(50, 2, 'Melyik évben omlott le a berlini fal?', '1989', '1985', '1987', '1991'),
(51, 2, 'Ki volt az első ember, aki az űrbe jutott?', 'Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin', 'Alan Shepard'),
(52, 2, 'Melyik híres hajós fedezte fel Amerikát 1492-ben?', 'Kolumbusz Kristóf', 'Vasco da Gama', 'Ferdinánd Magellán', 'James Cook'),
(53, 2, 'Melyik egyiptomi uralkodó építtetett hatalmas piramisokat?', 'Kheopsz', 'Tutanhamon', 'Kleopátra', 'II. Ramszesz'),
(54, 2, 'Ki volt a híres magyar fejedelem, aki legyőzte a német-római császárt a 907-es pozsonyi csatában?', 'Árpád fejedelem', 'Szent István', 'Géza fejedelem', 'Hunyadi János'),
(55, 27, 'Ki írta az „Anyám tyúkja” című verset?', 'Petőfi Sándor', 'Ady Endre', 'József Attila', 'Arany János'),
(56, 27, 'Melyik mű szereplője Boka és Áts Feri?', 'A Pál utcai fiúk', 'Légy jó mindhalálig', 'Kőszívű ember fiai', 'Egri csillagok'),
(57, 27, 'Ki a „Tragédia” főszereplője?', 'Ádám', 'Lucifer', 'Éva', 'Isten'),
(58, 27, 'Ki írta a „Szeptember végén” című verset?', 'Petőfi Sándor', 'Vörösmarty Mihály', 'Radnóti Miklós', 'Juhász Gyula'),
(59, 27, 'Melyik regény főhőse Nyilas Misi?', 'Légy jó mindhalálig', 'A kőszívű ember fiai', 'Az arany ember', 'Egri csillagok'),
(60, 27, 'Melyik mű szerzője Kosztolányi Dezső?', 'Édes Anna', 'Az arany ember', 'Kincskereső kisködmön', 'A tizedes meg a többiek'),
(61, 27, 'Ki írta az „Esti Kornél” novellaciklust?', 'Kosztolányi Dezső', 'Móricz Zsigmond', 'Babits Mihály', 'Karinthy Frigyes'),
(62, 27, 'Melyik költő írta a „Tiszta szívvel” című verset?', 'József Attila', 'Ady Endre', 'Radnóti Miklós', 'Pilinszky János'),
(63, 27, 'Ki írta a „Csongor és Tünde” című művet?', 'Vörösmarty Mihály', 'Jókai Mór', 'Arany János', 'Móricz Zsigmond'),
(64, 27, 'Melyik regény szereplője Bornemissza Gergely?', 'Egri csillagok', 'A kőszívű ember fiai', 'A Pál utcai fiúk', 'Légy jó mindhalálig'),
(65, 27, 'Ki írta a „Holtak szigete” című verset?', 'Ady Endre', 'Babits Mihály', 'Juhász Gyula', 'Weöres Sándor'),
(66, 27, 'Ki a Ludas Matyi írója?', 'Fazekas Mihály', 'Petőfi Sándor', 'Arany János', 'Mikszáth Kálmán'),
(67, 27, 'Melyik mű írta meg az 1848-49-es szabadságharc történetét?', 'A kőszívű ember fiai', 'Légy jó mindhalálig', 'Egri csillagok', 'Kincskereső kisködmön'),
(68, 27, 'Ki írta a „Szindbád” novellákat?', 'Krúdy Gyula', 'Móricz Zsigmond', 'Kosztolányi Dezső', 'Babits Mihály'),
(69, 27, 'Ki volt a „Toldi” című elbeszélő költemény szerzője?', 'Arany János', 'Jókai Mór', 'Petőfi Sándor', 'Vörösmarty Mihály'),
(70, 28, 'Ki a híres „Thriller” című dal előadója?', 'Michael Jackson', 'Prince', 'Madonna', 'Elvis Presley'),
(71, 28, 'Melyik zenekar adta ki a „Bohemian Rhapsody”-t?', 'Queen', 'The Beatles', 'Led Zeppelin', 'Pink Floyd'),
(72, 28, 'Hány húrja van egy átlagos gitárnak?', '6', '4', '8', '12'),
(73, 28, 'Melyik hangszert szokták ütővel megszólaltatni?', 'Dob', 'Zongora', 'Gitár', 'Fuvola'),
(74, 28, 'Melyik zenei műfaj származik Jamaikából?', 'Reggae', 'Rock', 'Jazz', 'Blues'),
(75, 29, 'Melyik cég készítette az első kereskedelmi elektromos autót?', 'Tesla', 'Nissan', 'BMW', 'Mercedes'),
(76, 29, 'Melyik évben jelent meg az első iPhone?', '2007', '2005', '2009', '2011'),
(77, 29, 'Melyik technológia felelős a kriptovaluták működéséért?', 'Blockchain', 'AI', 'Big Data', 'IoT'),
(78, 29, 'Melyik böngészőt fejlesztette a Google?', 'Chrome', 'Firefox', 'Safari', 'Opera'),
(79, 29, 'Melyik a világ legnagyobb közösségi média platformja?', 'Facebook', 'Instagram', 'Twitter', 'Snapchat'),
(80, 30, 'Ki festette a „Csillagos éj” című festményt?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'),
(81, 30, 'Melyik stílus kapcsolódik Salvador Dalíhoz?', 'Szürrealizmus', 'Kubizmus', 'Barokk', 'Impresszionizmus'),
(82, 30, 'Melyik ország híres a szamuráj művészetéről?', 'Japán', 'Kína', 'Korea', 'Thaiföld'),
(83, 30, 'Ki alkotta meg a Mona Lisát?', 'Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'),
(84, 30, 'Melyik múzeumban található a Louvre?', 'Párizs', 'Róma', 'Madrid', 'Berlin'),
(85, 31, 'Melyik ország híres az olívaolajáról?', 'Olaszország', 'Franciaország', 'Németország', 'Ausztria'),
(86, 31, 'Mi a sushi alapvető összetevője?', 'Rizs', 'Tészta', 'Kenyér', 'Kukorica'),
(87, 31, 'Melyik gyümölcsből készül a guacamole?', 'Avokádó', 'Banán', 'Alma', 'Szőlő'),
(88, 31, 'Melyik fűszer színe piros?', 'Paprika', 'Bors', 'Kardamom', 'Sáfrány'),
(89, 31, 'Melyik étel mexikói eredetű?', 'Taco', 'Sushi', 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', 'Baguette');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kommentek`
--

CREATE TABLE `kommentek` (
  `komment_id` int(11) NOT NULL,
  `komment_felhasznalo` varchar(255) NOT NULL,
  `komment_kviz` int(11) NOT NULL,
  `komment_szoveg` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `kommentek`
--

INSERT INTO `kommentek` (`komment_id`, `komment_felhasznalo`, `komment_kviz`, `komment_szoveg`) VALUES
(1, 'anna@gmail.com', 30, 'Jó kvíz, csak egy kicsit rövid. Lehetne több kérdés.'),
(2, 'benjamin@gmail.com', 2, 'Túl nehéz, rosszabb mint a töri érettségi. :('),
(3, 'emese@gmail.com', 26, 'Garfield <3'),
(4, 'daniel@gmail.com', 31, 'Ettől éhes lettem...'),
(5, 'gergo@gmail.com', 26, 'Kicsit könnyű, de jó volt!');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kvizek`
--

CREATE TABLE `kvizek` (
  `kviz_id` int(11) NOT NULL,
  `felhasznalo_email` varchar(255) NOT NULL,
  `kviz_nev` varchar(50) NOT NULL,
  `kviz_kategoria` int(11) NOT NULL,
  `kviz_leiras` varchar(255) NOT NULL,
  `kviz_kitoltesek` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `kvizek`
--

INSERT INTO `kvizek` (`kviz_id`, `felhasznalo_email`, `kviz_nev`, `kviz_kategoria`, `kviz_leiras`, `kviz_kitoltesek`) VALUES
(2, 'tamas@gmail.com', 'Világtörténelem', 2, 'Teszteld a tudásod a világ történelméről.', 10),
(26, 'tamas@gmail.com', 'Garfield kvíz', 19, 'Egy kvíz Garfieldról. A ChatGPT segítségével készítettem.', 5),
(27, 'anna@gmail.com', 'Magyar Irodalom Kvíz', 4, 'Kérdések Magyar Irodalommal kapcsolatban', 3),
(28, 'gergo@gmail.com', 'Zenei Kvíz', 10, 'Mennyire ismered a zenét? Teszteld a tudásod!', 1),
(29, 'daniel@gmail.com', 'Technológiai Újdonságok', 12, 'Kérdések a technológia világából.', 3),
(30, 'emese@gmail.com', 'Művészet Kvíz', 11, 'Mennyit tudsz híres festményekről és művészekről?', 6),
(31, 'gergo@gmail.com', 'Gasztronómia Teszt', 9, 'Mennyire ismered az ételeket és ízeket?', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `visszajelzesek`
--

CREATE TABLE `visszajelzesek` (
  `visszajelzes_id` int(11) NOT NULL,
  `visszajelzes_felhasznalo` varchar(255) NOT NULL,
  `visszajelzes_datum` datetime NOT NULL,
  `visszajelzes_tema` varchar(50) NOT NULL,
  `visszajelzes_tipus` varchar(255) NOT NULL,
  `visszajelzes_uzenet` varchar(255) NOT NULL,
  `visszajelzes_megoldva` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `visszajelzesek`
--

INSERT INTO `visszajelzesek` (`visszajelzes_id`, `visszajelzes_felhasznalo`, `visszajelzes_datum`, `visszajelzes_tema`, `visszajelzes_tipus`, `visszajelzes_uzenet`, `visszajelzes_megoldva`) VALUES
(20, 'benjamin@gmail.com', '2024-12-05 07:23:32', 'Kevés kategória', 'javaslat', 'Lehetne több kategória, nincs elég', 1),
(35, 'gergo@gmail.com', '2024-10-05 09:10:00', 'Felhasználói profil', 'javaslat', 'Jó lenne, ha lehetne profilképet beállítani.', 0),
(36, 'daniel@gmail.com', '2024-10-10 18:30:00', 'Játékélmény', 'egyéb', 'Nagyon élvezem a kvízeket, köszönöm!', 1),
(38, 'benjamin@gmail.com', '2024-11-03 15:05:00', 'Kvíz készítése', 'javaslat', 'Lehessen képeket is hozzáadni a kérdésekhez.', 1),
(39, 'tamas@gmail.com', '2024-11-15 11:50:00', 'Kvíz törlése', 'hiba', 'Nem tudom törölni a saját kvízemet.', 0),
(40, 'anna@gmail.com', '2024-11-28 08:30:00', 'Időzítés', 'javaslat', 'Lehetne több idő a kérdések megválaszolására.', 1),
(41, 'gergo@gmail.com', '2024-12-02 16:40:00', 'Felhasználók', 'report', 'Egyes felhasználók trágár tartalmakat töltenek fel.', 1),
(43, 'emese@gmail.com', '2024-12-18 10:10:00', 'Dizájn', 'javaslat', 'Sötét mód bevezetése jó lenne.', 0),
(44, 'benjamin@gmail.com', '2024-12-25 22:45:00', 'Keresés', 'hiba', 'Nem működik a kvízek kereső funkciója.', 1),
(45, 'tamas@gmail.com', '2025-01-05 14:20:00', 'Kérdések', 'egyéb', 'Nagyon jó, hogy sokféle témában vannak kvízek!', 1),
(46, 'anna@gmail.com', '2025-01-10 17:30:00', 'Értesítések', 'javaslat', 'Lehessen értesítéseket kapni új kvízekről.', 0),
(47, 'gergo@gmail.com', '2025-01-18 09:50:00', 'Hozzászólások', 'hiba', 'A hozzászólásaim nem jelennek meg a kvízek alatt.', 1),
(48, 'daniel@gmail.com', '2025-01-25 20:10:00', 'Moderáció', 'report', 'Sok kvízben hamis információk vannak.', 0),
(49, 'emese@gmail.com', '2025-02-02 12:40:00', 'Fiók törlése', 'hiba', 'Nem tudom véglegesen törölni a fiókomat.', 0),
(50, 'benjamin@gmail.com', '2025-02-08 15:55:00', 'Pontszámítás', 'javaslat', 'Több pontot kellene adni a gyors válaszokért.', 0),
(51, 'tamas@gmail.com', '2025-02-12 11:30:00', 'Töltési idő', 'hiba', 'A kvízek betöltése lassú.', 0),
(52, 'anna@gmail.com', '2025-02-20 08:15:00', 'Profil szerkesztés', 'hiba', 'Nem tudom módosítani az e-mail címem.', 0),
(53, 'gergo@gmail.com', '2025-02-25 14:55:00', 'UI fejlesztés', 'javaslat', 'Lehessen szűrni a kvízeket nehézségi szint szerint.', 1),
(54, 'daniel@gmail.com', '2025-03-01 16:20:00', 'Nyelvi hibák', 'report', 'Sok kvízben helyesírási hibák vannak.', 0),
(55, 'emese@gmail.com', '2025-03-05 18:40:00', 'Hozzáférés', 'hiba', 'Nem tudok bejelentkezni másik eszközről.', 1),
(56, 'benjamin@gmail.com', '2025-03-08 19:55:00', 'Játékmechanika', 'javaslat', 'Jó lenne napi kihívás funkció.', 0),
(57, 'tamas@gmail.com', '2025-03-10 09:15:00', 'Moderálás', 'report', 'Vannak kvízek, amelyek sértő tartalmat tartalmaznak.', 1),
(58, 'anna@gmail.com', '2025-03-12 14:25:00', 'Mobil verzió', 'hiba', 'A mobil app néha összeomlik.', 1),
(59, 'gergo@gmail.com', '2025-03-14 21:35:00', 'Felhasználók', 'report', 'Van egy felhasználó, aki spam kvízeket tölt fel.', 1),
(61, 'emese@gmail.com', '2025-03-16 22:10:00', 'Toplista', 'javaslat', 'Jó lenne heti és havi ranglisták is.', 0),
(62, 'benjamin@gmail.com', '2025-03-17 15:20:00', 'Kategóriák', 'hiba', 'A kategóriák szerinti szűrés nem működik.', 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD PRIMARY KEY (`ertekeles_id`),
  ADD KEY `ertekeles_felhasznalo` (`ertekeles_felhasznalo`),
  ADD KEY `ertekeles_kviz` (`ertekeles_kviz`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`felhasznalo_email`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`kategoria_id`);

--
-- A tábla indexei `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD PRIMARY KEY (`kerdes_id`),
  ADD KEY `kviz_id` (`kerdes_kviz`);

--
-- A tábla indexei `kommentek`
--
ALTER TABLE `kommentek`
  ADD PRIMARY KEY (`komment_id`),
  ADD KEY `komment_felhasznalo` (`komment_felhasznalo`),
  ADD KEY `komment_kviz` (`komment_kviz`);

--
-- A tábla indexei `kvizek`
--
ALTER TABLE `kvizek`
  ADD PRIMARY KEY (`kviz_id`),
  ADD KEY `felhasznalo_email` (`felhasznalo_email`),
  ADD KEY `kategoria` (`kviz_kategoria`);

--
-- A tábla indexei `visszajelzesek`
--
ALTER TABLE `visszajelzesek`
  ADD PRIMARY KEY (`visszajelzes_id`),
  ADD KEY `felhasznalo_email` (`visszajelzes_felhasznalo`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  MODIFY `ertekeles_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `kategoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  MODIFY `kerdes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT a táblához `kommentek`
--
ALTER TABLE `kommentek`
  MODIFY `komment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `kvizek`
--
ALTER TABLE `kvizek`
  MODIFY `kviz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT a táblához `visszajelzesek`
--
ALTER TABLE `visszajelzesek`
  MODIFY `visszajelzes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `ertekelesek_ibfk_1` FOREIGN KEY (`ertekeles_felhasznalo`) REFERENCES `felhasznalok` (`felhasznalo_email`),
  ADD CONSTRAINT `ertekelesek_ibfk_2` FOREIGN KEY (`ertekeles_kviz`) REFERENCES `kvizek` (`kviz_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD CONSTRAINT `kerdesek_ibfk_1` FOREIGN KEY (`kerdes_kviz`) REFERENCES `kvizek` (`kviz_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kommentek`
--
ALTER TABLE `kommentek`
  ADD CONSTRAINT `kommentek_ibfk_1` FOREIGN KEY (`komment_kviz`) REFERENCES `kvizek` (`kviz_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kommentek_ibfk_2` FOREIGN KEY (`komment_felhasznalo`) REFERENCES `felhasznalok` (`felhasznalo_email`);

--
-- Megkötések a táblához `kvizek`
--
ALTER TABLE `kvizek`
  ADD CONSTRAINT `kvizek_ibfk_1` FOREIGN KEY (`felhasznalo_email`) REFERENCES `felhasznalok` (`felhasznalo_email`),
  ADD CONSTRAINT `kvizek_ibfk_2` FOREIGN KEY (`kviz_kategoria`) REFERENCES `kategoriak` (`kategoria_id`);

--
-- Megkötések a táblához `visszajelzesek`
--
ALTER TABLE `visszajelzesek`
  ADD CONSTRAINT `visszajelzesek_ibfk_1` FOREIGN KEY (`visszajelzes_felhasznalo`) REFERENCES `felhasznalok` (`felhasznalo_email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
