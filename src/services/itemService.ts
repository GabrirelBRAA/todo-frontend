interface Item {
    id?: string,
    title: string,
    description: string,
    user_id?: string
}

class ItemService {
	private url: string;

	constructor(url: string) {
		this.url = url;
	}

	async create(item: Item) {
		const url = `${this.url}/items`;
		const response = await fetch(url, {
			method: "POST",
            credentials: 'include',
			body: JSON.stringify(item),
		});
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result["detail"]);
		}
		return result;
    }

	async list(page: number = 0, limit: number = 10): Promise<[Item]> {
        const search_params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        })
		const url = `${this.url}/items?${search_params}`
		const response = await fetch(url, {
            credentials: 'include',
		});
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result["detail"]);
		}
		return result;
    }
}

export const itemService = new ItemService("http://127.0.0.1:8000")