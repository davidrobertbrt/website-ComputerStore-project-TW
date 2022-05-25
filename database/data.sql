PGDMP                         z           db-pixelpro    14.2    14.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16395    db-pixelpro    DATABASE     l   CREATE DATABASE "db-pixelpro" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Romanian_Romania.1250';
    DROP DATABASE "db-pixelpro";
                postgres    false            9           1247    16495 
   cat_produs    TYPE     G   CREATE TYPE public.cat_produs AS ENUM (
    'desktop',
    'laptop'
);
    DROP TYPE public.cat_produs;
       public          postgres    false            <           1247    16500    cond_produs    TYPE     @   CREATE TYPE public.cond_produs AS ENUM (
    'nou',
    'sh'
);
    DROP TYPE public.cond_produs;
       public          postgres    false            E           1247    16584    ocupatie_client    TYPE     �   CREATE TYPE public.ocupatie_client AS ENUM (
    'programator',
    'contabil',
    'mecanic',
    'brutar',
    'functionar',
    'profesor',
    'neangajat',
    'nespecificat'
);
 "   DROP TYPE public.ocupatie_client;
       public          postgres    false            ?           1247    16563    producator_produs    TYPE     a   CREATE TYPE public.producator_produs AS ENUM (
    'dell',
    'asus',
    'hp',
    'lenovo'
);
 $   DROP TYPE public.producator_produs;
       public          postgres    false            H           1247    16602    rol_utilizator    TYPE     Y   CREATE TYPE public.rol_utilizator AS ENUM (
    'comun',
    'moderator',
    'admin'
);
 !   DROP TYPE public.rol_utilizator;
       public          postgres    false            �            1259    16572    produse    TABLE     �  CREATE TABLE public.produse (
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
    DROP TABLE public.produse;
       public         heap    postgres    false    825    828    831            �            1259    16571    produse_id_seq    SEQUENCE     �   CREATE SEQUENCE public.produse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.produse_id_seq;
       public          postgres    false    210                       0    0    produse_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.produse_id_seq OWNED BY public.produse.id;
          public          postgres    false    209            �            1259    16640    utilizatori    TABLE     �  CREATE TABLE public.utilizatori (
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
    DROP TABLE public.utilizatori;
       public         heap    postgres    false    840    837    840    837            �            1259    16639    utilizatori_id_seq    SEQUENCE     �   CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.utilizatori_id_seq;
       public          postgres    false    212                       0    0    utilizatori_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;
          public          postgres    false    211            p           2604    16575 
   produse id    DEFAULT     h   ALTER TABLE ONLY public.produse ALTER COLUMN id SET DEFAULT nextval('public.produse_id_seq'::regclass);
 9   ALTER TABLE public.produse ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            t           2604    16643    utilizatori id    DEFAULT     p   ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);
 =   ALTER TABLE public.utilizatori ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    212    212            {           2606    16581    produse produse_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.produse DROP CONSTRAINT produse_pkey;
       public            postgres    false    210            }           2606    16648    utilizatori utilizatori_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.utilizatori DROP CONSTRAINT utilizatori_pkey;
       public            postgres    false    212           