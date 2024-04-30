const Menu = require('../../models/menu')
// function homeController() {
//     return {
//         // async index(req, res) {
//         //     const pizzas = await Menu.find()
//         //     return res.render('home', { pizzas: pizzas })
//         // }
        
        
//     }
    
// }
// function home(){
//     return{
//         home(req,res){
//             return res.render('index')
//         }

//     }
// }




const menuController = {
    // async index(req, res) {
    //     const pizzas = await Menu.find()
    //     return res.render('home', { pizzas: pizzas })
    // },
    renderForm(req, res) {
        // Render the HTML form for adding a new menu item
        res.render('business/insert');
    },
    async addMenuItem(req, res) {
        try {
            const { name, price, size } = req.body;

            // Check for missing fields
            if (!name || !price || !size || !req.file) {
                return res.status(400).send('Missing required fields');
            }

            // Create a new menu item
            const menuItem = new Menu({ name, price, size, image: req.file.originalname });
            await menuItem.save();
            return res.send('<script>alert("Menu added succesfully."); window.location.href="/insert";</script>');
            // Redirect back to the form page after adding the menu item

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    async index(req, res) {
        const pizzas = await Menu.find()
        return res.render('home', { pizzas: pizzas })
    },
    home(req,res){
        return res.render('index')
    }
    

    // Other menu-related functions can be added here
};


module.exports = menuController