/****************************************************************************************************/
/****************************************************************************************************/
--CREACIÓN DE TABLAS E INSERCCIÓN DE DATOS
CREATE TABLE Clasificacion (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL,
    estado CHAR(1) DEFAULT 'S',
    userCreate NVARCHAR(50) NULL,
    fecrre DATETIME DEFAULT GETDATE(),
    userModify NVARCHAR(50) NULL,
    fecmov DATETIME NULL
);
INSERT INTO Clasificacion (nombre, descripcion, estado) VALUES
('ATP', 'Apta para todo público', 'S'),
('+13', 'Mayores de 13 años', 'S'),
('+18', 'Solo adultos', 'S');


CREATE TABLE Genero (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL UNIQUE,  -- Ej: Acción, Comedia, Drama
    descripcion NVARCHAR(255) NULL,
    estado CHAR(1) DEFAULT 'S',
    userCreate NVARCHAR(50) NULL,
    fecrre DATETIME DEFAULT GETDATE(),
    userModify NVARCHAR(50) NULL,
    fecmov DATETIME NULL
);
INSERT INTO Genero (nombre, descripcion, estado) VALUES
('Acción', 'Películas con escenas de acción', 'S'),
('Comedia', 'Películas cómicas', 'S'),
('Drama', 'Películas dramáticas', 'S');


CREATE TABLE Peliculas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(255) NOT NULL UNIQUE,
    sinopsis NVARCHAR(MAX) NULL,
    duracionMin INT NOT NULL,
    clasificacionId INT NOT NULL,
    generoId INT NOT NULL,
    estado CHAR(1),
    fechaEstreno DATETIME NULL,
    userCreate NVARCHAR(50) NULL,
    fecrre DATETIME DEFAULT GETDATE(),
    userModify NVARCHAR(50) NULL,
    fecmov DATETIME NULL,
    CONSTRAINT FK_Peliculas_Clasificacion FOREIGN KEY (clasificacionId) REFERENCES Clasificacion(id),
    CONSTRAINT FK_Peliculas_Genero FOREIGN KEY (generoId) REFERENCES Genero(id)
);
INSERT INTO Peliculas 
(
    titulo,
    sinopsis,
    duracionMin,
    clasificacionId,
    generoId,
    estado,
    fechaEstreno,
    userCreate
)
VALUES
(
    'Edgame',
    'Los vengadores afrontan una travesia a travez del tiempo para arreglar lo que paso en el pasado.',
    156,
    2,
    1,
    'S',
    '2025-12-15',
    'BMELENDEZ'
);


CREATE TABLE Turnos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    peliculaId INT NOT NULL,
    sala NVARCHAR(50) NOT NULL,
    inicio DATETIME2(0) NOT NULL,
    fin DATETIME2(0) NOT NULL,
    precio DECIMAL(10,2) NULL,
    idioma NVARCHAR(20) NULL, 
    formato VARCHAR(2) NULL,
    aforo INT NULL,
    estado CHAR(1)
    ,userCreate NVARCHAR(50) NULL
    ,fecrre DATETIME DEFAULT GETDATE()
    ,userModify NVARCHAR(50) NULL
    ,fecmov DATETIME NULL
    ,CONSTRAINT FK_Turnos_Peliculas FOREIGN KEY (peliculaId) REFERENCES Peliculas(id)
);
/****************************************************************************************************/
/****************************************************************************************************/




/****************************************************************************************************/
/****************************************************************************************************/
--PROCEDURES PARA EL CRUD DE PELICULAS
CREATE OR ALTER PROCEDURE pa_InsPelicula
@titulo NVARCHAR(255),
@sinopsis NVARCHAR(MAX),
@duracionMin INT,
@clasificacionId INT,
@generoId INT,
@fechaEstreno DATETIME,
@userCreate NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO Peliculas
        (
            titulo,
            sinopsis,
            duracionMin,
            clasificacionId,
            generoId,
            estado,
            fechaEstreno,
            userCreate,
            fecrre
        )
        VALUES
        (
            @titulo,
            @sinopsis,
            @duracionMin,
            @clasificacionId,
            @generoId,
            'S',
            @fechaEstreno,
            @userCreate,
            GETDATE()
        );
        COMMIT TRANSACTION;

        SELECT 'Película creada exitosamente' AS mensaje;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_LINE() AS ErrorLine;
    END CATCH
END;


CREATE PROCEDURE sp_UpdPelicula
@id INT,
@titulo NVARCHAR(255),
@sinopsis NVARCHAR(MAX),
@duracionMin INT,
@clasificacion INT,
@genero INT,
@fechaEstreno DATETIME,
@userModify NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY

    IF NOT EXISTS (SELECT 1 FROM Peliculas WHERE id = @id)
    BEGIN
      RAISERROR('La película con el ID especificado no existe.', 16, 1);
      RETURN;
    END

	BEGIN TRANSACTION;
    -- Actualizar la película
    UPDATE Peliculas
    SET 
      titulo = @titulo,
      sinopsis = @sinopsis,
      duracionMin = @duracionMin,
      clasificacionId = @clasificacion,
      generoId = @genero,
      fechaEstreno = @fechaEstreno,
      userModify = @userModify,
      fecmov = GETDATE()
    WHERE id = @id;

    COMMIT TRANSACTION;

	SELECT 'Película actualizado exitosamente' AS mensaje;
  END TRY

  BEGIN CATCH
    ROLLBACK TRANSACTION;
    SELECT 
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_LINE() AS ErrorLine;
  END CATCH
END;


CREATE OR ALTER PROCEDURE sp_DelPelicula
@id INT,
@userModify NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE Peliculas
        SET estado = 'N',
            userModify = @userModify
        WHERE id = @id;

        COMMIT TRANSACTION;

		SELECT 'Película creada exitosamente' AS mensaje;
    END TRY
    BEGIN CATCH
		ROLLBACK TRANSACTION;
		SELECT 
			ERROR_NUMBER() AS ErrorNumber,
			ERROR_MESSAGE() AS ErrorMessage,
			ERROR_SEVERITY() AS ErrorSeverity,
			ERROR_LINE() AS ErrorLine;
    END CATCH
END;
/****************************************************************************************************/
/****************************************************************************************************/




/****************************************************************************************************/
/****************************************************************************************************/
--PROCEDURES PARA EL CRUD DE TURNOS
CREATE OR ALTER PROCEDURE sp_InsTurno
@peliculaId INT,
@sala NVARCHAR(50),
@inicio DATETIME,
@fin DATETIME,
@precio DECIMAL(10,2),
@idioma NVARCHAR(50),
@formato NVARCHAR(50),
@aforo INT,
@userCreate NVARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRANSACTION;

    INSERT INTO Turnos (peliculaId, sala, inicio, fin, precio, idioma, formato, aforo, estado, userCreate, fecrre)
    VALUES (@peliculaId, @sala, @inicio, @fin, @precio, @idioma, @formato, @aforo, 'S', @userCreate, GETDATE());

    COMMIT TRANSACTION;

	SELECT 'Turno creada exitosamente' AS mensaje;
  END TRY
  BEGIN CATCH
	ROLLBACK TRANSACTION;
	SELECT 
		ERROR_NUMBER() AS ErrorNumber,
		ERROR_MESSAGE() AS ErrorMessage,
		ERROR_SEVERITY() AS ErrorSeverity,
		ERROR_LINE() AS ErrorLine;
  END CATCH
END;


CREATE OR ALTER PROCEDURE sp_UpdTurno
@id INT,
@sala NVARCHAR(50),
@inicio DATETIME,
@fin DATETIME,
@precio DECIMAL(10,2),
@idioma NVARCHAR(50),
@formato NVARCHAR(50),
@aforo INT,
@userModify NVARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE Turnos
    SET sala = @sala,
        inicio = @inicio,
        fin = @fin,
        precio = @precio,
        idioma = @idioma,
        formato = @formato,
        aforo = @aforo,
        userModify = @userModify,
        fecmov = GETDATE()
    WHERE id = @id;

    COMMIT TRANSACTION;

	SELECT 'Turno actualizado exitosamente' AS mensaje;
  END TRY
  BEGIN CATCH
	ROLLBACK TRANSACTION;
	SELECT 
		ERROR_NUMBER() AS ErrorNumber,
		ERROR_MESSAGE() AS ErrorMessage,
		ERROR_SEVERITY() AS ErrorSeverity,
		ERROR_LINE() AS ErrorLine;
  END CATCH
END;


CREATE OR ALTER PROCEDURE sp_DelTurno
  @id INT,
  @userModify NVARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE Turnos
    SET estado = 'N',
        userModify = @userModify
    WHERE id = @id;

    COMMIT TRANSACTION;

	SELECT 'Turno eliminado exitosamente' AS mensaje;
  END TRY
  BEGIN CATCH
   ROLLBACK TRANSACTION;
	SELECT 
		ERROR_NUMBER() AS ErrorNumber,
		ERROR_MESSAGE() AS ErrorMessage,
		ERROR_SEVERITY() AS ErrorSeverity,
		ERROR_LINE() AS ErrorLine;
  END CATCH
END;
/****************************************************************************************************/
/****************************************************************************************************/