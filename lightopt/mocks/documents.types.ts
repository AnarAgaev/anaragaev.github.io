/*
	Структура данных:


	Документ:

		id - уникальный идентификатор
		path - путь к файлу в файловой системе
		name - имя файла (хеш)
		title - понятное название документа
		ext - расширение (все PDF)
		size - размер файла в байтах
		dir_name - тип документа (cert, drawing_pdf, other, ai)
		dir_title - описание типа на русском языке
		download_link - ссылка для скачивания
		products - массив связанных товаров

	Типы документов:

		cert - Сертификаты
		drawing_pdf - Технические рисунки
		other - Презентационные материалы
		ai - Инструкции по сборке

	Производители: GAUSS и ARTE LAMP

	Коллекции: SMD, BASIC, TRENO, FILAMENT, DIMMER, G4, LONDON, GALATEA, TRAPEZE, BUDAPEST, INTRECCIO и др.
*/

/**
 * Информация о продукте, связанном с документом
 */
interface Product {
	/** Артикул товара */
	article: string;
	/** Хеш артикула */
	article_hash: string;
	/** Коллекция, к которой относится товар */
	collection: string;
	/** Производитель товара */
	vendor: string;
}

/**
 * Документ в системе
 */
interface Document {
	/** Уникальный идентификатор документа */
	id: number;
	/** Путь к файлу в файловой системе */
	path: string;
	/** Имя файла (обычно хеш) */
	name: string;
	/** Понятное название документа */
	title: string;
	/** Расширение файла */
	ext: string;
	/** Размер файла в байтах */
	size: number;
	/** Техническое название директории/типа документа */
	dir_name: string;
	/** Описание типа документа на русском языке */
	dir_title: string;
	/** Ссылка для скачивания документа */
	download_link: string;
	/** Список продуктов, связанных с этим документом */
	products: Product[];
}

/**
 * Корневой тип - массив документов
 */
type Documents = Document[];

// Экспорт типов
export type { Product, Document, Documents };

// Дополнительные типы для удобства

/**
 * Возможные типы директорий документов
 */
type DocumentDirName = "cert" | "drawing_pdf" | "other" | "ai";

/**
 * Описания типов документов на русском
 */
type DocumentDirTitle =
	| "Сертификаты"
	| "Технические рисунки"
	| "Презентационные материалы"
	| "Инструкции по сборке";

/**
 * Известные производители
 */
type Vendor = "GAUSS" | "ARTE LAMP";

/**
 * Примеры известных коллекций
 */
type Collection =
	| "SMD"
	| "BASIC"
	| "TRENO"
	| "FILAMENT"
	| "DIMMER"
	| "G4"
	| "LONDON"
	| "GALATEA"
	| "TRAPEZE"
	| "BUDAPEST"
	| "INTRECCIO"
	| string; // для других возможных коллекций

/**
 * Расширенный тип Document с более строгими типами
 */
interface StrictDocument extends Omit<Document, "dir_name" | "dir_title"> {
	dir_name: DocumentDirName;
	dir_title: DocumentDirTitle;
	products: StrictProduct[];
}

/**
 * Расширенный тип Product с более строгими типами
 */
interface StrictProduct extends Omit<Product, "vendor" | "collection"> {
	vendor: Vendor;
	collection: Collection;
}

export type {
	DocumentDirName,
	DocumentDirTitle,
	Vendor,
	Collection,
	StrictDocument,
	StrictProduct,
};
