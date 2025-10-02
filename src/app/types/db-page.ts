export type DbPage<T> = {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: { unsorted: boolean; sorted: boolean; empty: boolean };
		offset: number;
		unpaged: boolean;
		paged: boolean;
	};
	totalPages: number;
	totalElements: number;
	first: boolean;
	last: boolean;
	empty: boolean;
	numberOfElements: number;
	size: number;
	number: number;
	sort: { unsorted: boolean; sorted: boolean; empty: boolean };
};
