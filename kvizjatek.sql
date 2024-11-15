-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 15. 09:16
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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kerdesek`
--

CREATE TABLE `kerdesek` (
  `id` int(11) NOT NULL,
  `kerdes` varchar(255) NOT NULL,
  `valasz_jo` varchar(255) NOT NULL,
  `valasz_rossz1` varchar(255) NOT NULL,
  `valasz_rossz2` varchar(255) NOT NULL,
  `valasz_rossz3` varchar(255) NOT NULL,
  `kep` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kerdesek`
--

INSERT INTO `kerdesek` (`id`, `kerdes`, `valasz_jo`, `valasz_rossz1`, `valasz_rossz2`, `valasz_rossz3`, `kep`) VALUES
(1, 'Mi a fővárosa Magyarországnak?', 'Budapest', 'Debrecen', 'Szeged', 'Pécs', 'budapest.jpg'),
(2, 'Melyik bolygó a legnagyobb a Naprendszerben?', 'Jupiter', 'Mars', 'Föld', 'Vénusz', 'jupiter.jpg'),
(3, 'Milyen színű a fű?', 'Zöld', 'Kék', 'Sárga', 'Vörös', 'fu.jpg'),
(4, 'Ki festette a Mona Lisát?', 'Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'mona_lisa.jpg'),
(5, 'Milyen állat a delfin?', 'Emlős', 'Hüllő', 'Madár', 'Hal', 'delfin.jpg');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
