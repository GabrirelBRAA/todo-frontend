export interface Item {
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
            headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify(item),
		});
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result["detail"]);
		}
		return result;
    }

	async update(item: Item) {
		const url = `${this.url}/items/${item.id}`;
		const response = await fetch(url, {
			method: "PUT",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify(item),
		});
		if (!response.ok) {
		const result = await response.json();
			throw new Error(result["detail"]);
		}
    }

	async list(page: number = 0, limit: number = 10): Promise<{items: Item[], total_count: number}> {
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

    async delete(id: string){
		const url = `${this.url}/items/${id}`
		const response = await fetch(url, {
            credentials: 'include',
            method: 'DELETE'
		});
		if (!response.ok) {
		    const result = await response.json();
			throw new Error(result['detail']);
		}
    }
}

export const itemService = new ItemService("http://127.0.0.1:8000")