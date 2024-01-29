--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-06-03 01:00:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 827 (class 1247 OID 16495)
-- Name: cat_produs; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.cat_produs AS ENUM (
    'desktop',
    'laptop'
);


--
-- TOC entry 830 (class 1247 OID 16500)
-- Name: cond_produs; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.cond_produs AS ENUM (
    'nou',
    'sh'
);


--
-- TOC entry 839 (class 1247 OID 16584)
-- Name: ocupatie_client; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ocupatie_client AS ENUM (
    'programator',
    'contabil',
    'mecanic',
    'brutar',
    'functionar',
    'profesor',
    'neangajat',
    'nespecificat'
);


--
-- TOC entry 833 (class 1247 OID 16563)
-- Name: producator_produs; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.producator_produs AS ENUM (
    'dell',
    'asus',
    'hp',
    'lenovo'
);


--
-- TOC entry 842 (class 1247 OID 16602)
-- Name: rol_utilizator; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rol_utilizator AS ENUM (
    'comun',
    'moderator',
    'admin'
);


SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16654)
-- Name: accesari; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(256) NOT NULL,
    user_id integer,
    pagina text NOT NULL,
    data_accesare timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 213 (class 1259 OID 16653)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 210 (class 1259 OID 16572)
-- Name: produse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produse (
    id integer NOT NULL,
    nume character varying(512) NOT NULL,
    descriere text,
    imagine character varying(512),
    categorie public.cat_produs NOT NULL,
    stare public.cond_produs NOT NULL,
    pret real NOT NULL,
    putere real NOT NULL,
    so character varying(256)[] NOT NULL,
    gaming boolean DEFAULT false NOT NULL,
    stoc integer DEFAULT 5 NOT NULL,
    disponibil date DEFAULT CURRENT_TIMESTAMP,
    producator_produs public.producator_produs
);


--
-- TOC entry 209 (class 1259 OID 16571)
-- Name: produse_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.produse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.produse_id_seq OWNED BY public.produse.id;


--
-- TOC entry 212 (class 1259 OID 16640)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(512) NOT NULL,
    nume text NOT NULL,
    prenume text NOT NULL,
    email character varying(512) NOT NULL,
    parola text NOT NULL,
    data_inreg date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    culoare_chat character varying(64) DEFAULT 'black'::character varying,
    rol public.rol_utilizator DEFAULT 'comun'::public.rol_utilizator NOT NULL,
    ocupatie public.ocupatie_client DEFAULT 'nespecificat'::public.ocupatie_client NOT NULL,
    cale_imagine character varying(512),
    cod character varying(500) NOT NULL,
    confirmat_email boolean DEFAULT false NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 16639)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3199 (class 2604 OID 16657)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 16575)
-- Name: produse id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produse ALTER COLUMN id SET DEFAULT nextval('public.produse_id_seq'::regclass);


--
-- TOC entry 3193 (class 2604 OID 16643)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3351 (class 0 OID 16654)
-- Dependencies: 214
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accesari (id, ip, user_id, pagina, data_accesare) FROM stdin;
310	::ffff:127.0.0.1	\N	/	2022-05-28 13:36:57.251012+03
311	::ffff:127.0.0.1	\N	/	2022-05-28 13:36:58.966265+03
312	::ffff:127.0.0.1	\N	/	2022-05-28 13:36:59.008115+03
313	::ffff:127.0.0.1	\N	/	2022-05-28 13:37:29.948281+03
314	::ffff:127.0.0.1	\N	/	2022-05-28 13:37:57.472254+03
315	::ffff:127.0.0.1	33	/	2022-05-28 13:37:57.53523+03
316	::ffff:127.0.0.1	33	/	2022-05-28 13:38:19.652886+03
\.


--
-- TOC entry 3347 (class 0 OID 16572)
-- Dependencies: 210
-- Data for Name: produse; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.produse (id, nume, descriere, imagine, categorie, stare, pret, putere, so, gaming, stoc, disponibil, producator_produs) FROM stdin;
1	HP EliteBook 840 G3	14" FHD, TOUCHSCREEN, Intel Core i7-6600U pana la 3.40 GHz, 16GB DDR4, 512GB SSD, Webcam, GARANTIE 2 ANI	hp-elitebook-840-g3.JPG	laptop	sh	2690	35	{touchscreen,windows,intel,ddr4,ssd,fhd}	f	6	2022-05-09	hp
25	DELL Precision T5820	Intel Core i9-10900X 3.50 GHz, 128GB DDR4, 1TB SSD, nVidia GeForce RTX 3080, GARANTIE 3 ANI	dell-precision-t5820.jpg	desktop	nou	8500	450	{windows,intel,ddr4,ssd,nvidia}	t	10	2022-05-09	lenovo
26	LENOVO ThinkStation P510	Intel 14-Core Xeon E5-2680 v4 2.40GHz, 32GB DDR4 ECC, 1TB SSD, nVidia Quadro M4000, GARANTIE 3 ANI	lenovo-thinkstation-p510.JPG	desktop	nou	5790	300	{windows,intel,ddr4,ssd,nvidia}	f	15	2022-05-09	lenovo
27	LENOVO ThinkStation P500	Intel QUAD Core Xeon E5-1620 v3 3.50 GHz, 16GB DDR4 ECC, 250GB SSD + 2TB HDD, nVidia Quadro K620, DVDRW, GARANTIE 3 ANI	lenovo-thinkstation-p500.JPG	desktop	sh	2560	150	{windows,intel,ddr4,ssd,nvidia,dvd}	f	30	2022-05-09	lenovo
28	LENOVO ThinkPad P1 2nd Gen	15.6" FHD, Intel Core i7-9750H pana la 4.50 GHz, 32GB DDR4, 1TB SSD, nVidia Quadro T1000, GARANTIE 2 ANI	lenovo-2ndgen-p1.jpg	laptop	sh	6500	15	{windows,intel,ddr4,ssd,fhd,nvidia}	f	5	2022-05-09	lenovo
19	HP Spectre x360	15.6" UHD 4K, TOUCHSCREEN, Intel Core i7-10510U pana la 4.90 GHz, 16GB DDR4, 512GB SSD, nVidia GeForce MX330, GARANTIE 2 ANI	hp-spectre-x360.JPG	laptop	sh	6990	40	{touchscreen,windows,intel,ddr4,ssd,4k,nvidia}	f	15	2022-05-09	hp
20	HP Z840	HP Z840, 2 x Intel 22-Core Xeon E5-2699 v4 2.20 GHz, 128GB DDR4 ECC, 1TB SSD, nVidia Quadro M5000, GARANTIE 3 ANI	hp-z840.jpg	desktop	sh	13390	250	{windows,intel,ddr4,ssd,nvidia}	f	3	2022-05-09	hp
21	HP Z4 G4	Intel DECA Core Xeon W-2155 3.30GHz, 128GB DDR4, 2 x 1TB SSD, nVidia GeForce RTX 3060 Ti, GARANTIE 3 ANI	hp-z4-g4.jpg	desktop	nou	16990	500	{windows,intel,ddr4,ssd,nvidia}	t	10	2022-05-09	hp
22	DELL XPS 13 9300	13.4" FHD+, Intel Core i5-1035G1 pana la 3.60GHz, 8GB DDR4, 512GB SSD, Webcam, WHITE, GARANTIE 2 ANI	dell-xps-13-9300.jpg	laptop	sh	6000	25	{windows,intel,ddr4,ssd,fhd}	t	30	2022-05-09	dell
23	DELL Precision 5520	15.6" FHD, Intel Xeon QUAD Core E3-1505M v6 pana la 4.0 GHz, 16GB DDR4, 512GB SSD, nVidia Quadro M1200, GARANTIE 2 ANI	dell-precision-5520.jpg	laptop	sh	3790	15	{windows,intel,ddr4,ssd,fhd,nvidia}	f	12	2022-05-09	dell
24	DELL Precision T3430 SFF	Intel Xeon QUAD Core E-2174G 3.80 GHz, 32GB DDR4, 512GB SSD, nVidia Quadro P1000, DVDRW, GARANTIE 3 ANI	dell-precision-t3430-sff.jpg	desktop	sh	4190	200	{windows,intel,ddr4,ssd,dvd}	f	18	2022-05-09	dell
29	LENOVO ThinkPad X1 Carbon	14" FHD, Intel Core i7-8550U pana la 4.0 GHz, 16GB DDR3, 512GB SSD, GARANTIE 2 ANI	lenovo-thinkpad-x1-carbon.jpg	laptop	sh	4500	15	{windows,intel,ddr4,ssd,fhd,nvidia}	f	5	2022-05-09	asus
30	Asus X515FA	FHD, Procesor Intel Core i3-10110U (4M Cache, up to 4.10 GHz), 8GB DDR4, 256GB SSD, GMA UHD, No OS	asus-x515fa.jpg	laptop	nou	1800	5	{windows,intel,ddr4,ssd,fhd,nvidia}	f	5	2022-05-09	asus
31	Asus ROG Strix G15 G513QE	Procesor AMD Ryzen 7 5800H (16M Cache, up to 4.4 GHz), 16GB DDR4, 512GB SSD, GeForce RTX 3050 Ti 4GB, No OS, Original Black	Asus-ROG-Strix-G15-G513QE.jpg	laptop	nou	5121	30	{windows,amd,ddr4,ssd,fhd,nvidia}	t	0	2022-05-09	asus
\.


--
-- TOC entry 3349 (class 0 OID 16640)
-- Dependencies: 212
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.utilizatori (id, username, nume, prenume, email, parola, data_inreg, culoare_chat, rol, ocupatie, cale_imagine, cod, confirmat_email) FROM stdin;
33	david-bratosin	Bratosin	David - Robert	idigitmanager@idigit.ro	c61d3552f8e978bb09e1398e967425eff7fe7963b25a0667c1977c651ea6adad	2022-05-25	orange	admin	programator	uploads\\david-bratosin-5d17df0b35100f116debbb700.jpeg	PfJSe328ba695565b1597c68236b9f501afd53177f75a2f703bb0c58b458fc856348	t
\.


--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accesari_id_seq', 316, true);


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.produse_id_seq', 31, true);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 37, true);


--
-- TOC entry 3206 (class 2606 OID 16662)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 16581)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


--
-- TOC entry 3204 (class 2606 OID 16648)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


-- Completed on 2022-06-03 01:00:21

--
-- PostgreSQL database dump complete
--

