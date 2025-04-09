import axios from 'axios';

export default class OrderItemsService {
    private articleApiUrl = 'http://localhost:3000/api/articles';
    private menuApiUrl = 'http://localhost:3000/api/menus';

    // Récupérer tous les articles et menus
    async getArticlesAndMenus() {
        try {
            const [articlesResponse, menusResponse] = await Promise.all([
                axios.get(this.articleApiUrl),
                axios.get(this.menuApiUrl)
            ]);

            const articles = articlesResponse.data;
            const menus = menusResponse.data;

            return { articles, menus };
        } catch (error) {
            console.error('Erreur lors de la récupération des articles et menus:', error);
            throw new Error('Impossible de récupérer les données des articles et menus');
        }
    }

    //Récupérer l'id d'un article
    async getArticlesByRestaurant(menuId: string) {
        try {
            const articlesResponse = await axios.get(`${this.articleApiUrl}/menu/${menuId}`);
            return articlesResponse.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des articles pour le menu:', error);
            throw new Error('Impossible de récupérer les articles pour ce menu');
        }
    }

    //Récupérer l'ID d'un menu d'un restaurant spécifique
    async getMenusByRestaurant(restaurantId: string) {
        try {
            const menusResponse = await axios.get(`${this.menuApiUrl}/restaurant/${restaurantId}`);
            return menusResponse.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des menus pour le restaurant:', error);
            throw new Error('Impossible de récupérer les menus pour ce restaurant');
        }
    }


    //Récupérer l'ID d'une commande
    async getOrderId(orderId: string) {
        try {
            const orderResponse = await axios.get(`http://localhost:3000/api/orders/${orderId}`);
            return orderResponse.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            throw new Error('Impossible de récupérer la commande');
        }
    }
}