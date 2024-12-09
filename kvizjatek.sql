-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 09. 08:22
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

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
CREATE DATABASE IF NOT EXISTS `kvizjatek` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `kvizjatek`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `felhasznalo_email` varchar(255) NOT NULL,
  `felhasznalo_nev` varchar(20) NOT NULL,
  `felhasznalo_jelszo` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`felhasznalo_email`, `felhasznalo_nev`, `felhasznalo_jelszo`) VALUES
('dan@gmail.com', 'Dan', 'dan123'),
('joe@gmail.com', 'Joe', 'joe123'),
('valaki@gmail.com', 'Valaki', 'valaki');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `kategoria_id` int(11) NOT NULL,
  `kategoria_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`kategoria_id`, `kategoria_nev`) VALUES
(1, 'teszt'),
(2, 'Történelem'),
(3, 'Természet');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kerdesek`
--

CREATE TABLE `kerdesek` (
  `kerdes_id` int(11) NOT NULL,
  `kviz_id` int(11) NOT NULL,
  `kerdes` varchar(255) NOT NULL,
  `valasz_jo` varchar(50) NOT NULL,
  `valasz_rossz1` varchar(50) NOT NULL,
  `valasz_rossz2` varchar(50) NOT NULL,
  `valasz_rossz3` varchar(50) NOT NULL,
  `kep` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kerdesek`
--

INSERT INTO `kerdesek` (`kerdes_id`, `kviz_id`, `kerdes`, `valasz_jo`, `valasz_rossz1`, `valasz_rossz2`, `valasz_rossz3`, `kep`) VALUES
(1, 1, 'Mi a fővárosa Magyarországnak?', 'Budapest', 'Debrecen', 'Szeged', 'Pécs', 'magyarorszag.jpg'),
(2, 1, 'Melyik bolygó a legnagyobb a Naprendszerben?', 'Jupiter', 'Mars', 'Föld', 'Vénusz', 'bolygok.jpg'),
(3, 1, 'Milyen színű a fű?', 'Zöld', 'Kék', 'Sárga', 'Vörös', 'fu.png'),
(4, 1, 'Ki festette a Mona Lisát?', 'Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'mona_lisa.jpg'),
(5, 1, 'Milyen állat a delfin?', 'Emlős', 'Hüllő', 'Madár', 'Hal', 'delfin.png'),
(6, 2, 'Mikor tört ki a második világháború?', '1939', '1940', '1938', '1941', 'kep.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kvizek`
--

CREATE TABLE `kvizek` (
  `kviz_id` int(11) NOT NULL,
  `felhasznalo_email` varchar(255) NOT NULL,
  `kviz_nev` varchar(50) NOT NULL,
  `kategoria_id` int(11) NOT NULL,
  `kviz_leiras` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kvizek`
--

INSERT INTO `kvizek` (`kviz_id`, `felhasznalo_email`, `kviz_nev`, `kategoria_id`, `kviz_leiras`) VALUES
(1, 'valaki@gmail.com', 'Teszt kvíz', 1, 'Első kvíz tesztelésre'),
(2, 'valaki@gmail.com', 'Világtörténelem', 2, 'Teszteld a tudásod a világ történelméről.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `visszajelzesek`
--

CREATE TABLE `visszajelzesek` (
  `visszajelzes_id` int(11) NOT NULL,
  `felhasznalo_email` varchar(255) NOT NULL,
  `visszajelzes_tema` varchar(50) NOT NULL,
  `visszajelzes_tipus` varchar(255) NOT NULL,
  `visszajelzes_uzenet` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `visszajelzesek`
--

INSERT INTO `visszajelzesek` (`visszajelzes_id`, `felhasznalo_email`, `visszajelzes_tema`, `visszajelzes_tipus`, `visszajelzes_uzenet`) VALUES
(1, 'valaki@gmail.com', 'tema', 'javaslat', 'uzenet'),
(20, 'dan@gmail.com', 'Kevés kategória', 'javaslat', 'Lehetne több kategória, nincs elég'),
(21, 'joe@gmail.com', 'Weird bug', 'probléma', 'When I make one answer, all four answers become the same and can\'t make them different. Pls fix asap, can\'t do anything like this'),
(22, 'valaki@gmail.com', 'huh', 'egyéb', 'ez most csinál valamit?'),
(23, 'joe@gmail.com', 'Nvm', 'egyéb', 'Nevermind I\'m stupid there\'s no bug');

--
-- Indexek a kiírt táblákhoz
--

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
  ADD KEY `kviz_id` (`kviz_id`);

--
-- A tábla indexei `kvizek`
--
ALTER TABLE `kvizek`
  ADD PRIMARY KEY (`kviz_id`),
  ADD KEY `felhasznalo_email` (`felhasznalo_email`),
  ADD KEY `kategoria` (`kategoria_id`);

--
-- A tábla indexei `visszajelzesek`
--
ALTER TABLE `visszajelzesek`
  ADD PRIMARY KEY (`visszajelzes_id`),
  ADD KEY `felhasznalo_email` (`felhasznalo_email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `kategoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  MODIFY `kerdes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT a táblához `kvizek`
--
ALTER TABLE `kvizek`
  MODIFY `kviz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `visszajelzesek`
--
ALTER TABLE `visszajelzesek`
  MODIFY `visszajelzes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD CONSTRAINT `kerdesek_ibfk_1` FOREIGN KEY (`kviz_id`) REFERENCES `kvizek` (`kviz_id`);

--
-- Megkötések a táblához `kvizek`
--
ALTER TABLE `kvizek`
  ADD CONSTRAINT `kvizek_ibfk_1` FOREIGN KEY (`felhasznalo_email`) REFERENCES `felhasznalok` (`felhasznalo_email`),
  ADD CONSTRAINT `kvizek_ibfk_2` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`kategoria_id`);

--
-- Megkötések a táblához `visszajelzesek`
--
ALTER TABLE `visszajelzesek`
  ADD CONSTRAINT `visszajelzesek_ibfk_1` FOREIGN KEY (`felhasznalo_email`) REFERENCES `felhasznalok` (`felhasznalo_email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
