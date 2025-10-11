import React from 'react';
const CreateRecipeForm: React.FC = () => {

    return (
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-sm text-gray-700 mb-1">
                    Type
                </label>
                <select className="block px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-5">
                    <option value="">Select a Category</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="dessert">Dessert</option>
                    <option value="drink">Drink</option>
                    <option value="snack">Snack</option>
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Title/Name
              </label>
              <input 
                type="text" 
                name="recipeName" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prep Time (minutes):
                </label>
                <input 
                  type="number" 
                  name="prepTime" 
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cook Time (minutes):
                </label>
                <input 
                  type="number" 
                  name="cookTime" 
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings:
                </label>
                <input 
                  type="number" 
                  name="servings" 
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description:
              </label>
              <textarea 
                name="description" 
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients (one per line):
              </label>
              <textarea 
                name="ingredients" 
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </form>
    )
}

export default CreateRecipeForm;