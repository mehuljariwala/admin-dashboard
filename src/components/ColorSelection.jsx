import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getColors, getColorCategories } from "../lib/supabase";

const ColorCard = ({ color, value, onChange }) => {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer shadow-sm">
      <div
        className="p-3 text-center"
        style={{ backgroundColor: color.color_code }}
      ></div>
      <div className="p-4 text-center" style={{ backgroundColor: "#E8F3FA" }}>
        <div className="text-blue-600 text-xl font-medium">{color.name}</div>
        <div className="text-gray-800 text-2xl font-medium mt-1">
          {color.code}
        </div>
      </div>
      <div className="bg-white p-2 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(Math.max(0, (value || 0) - 1));
          }}
          className="w-10 text-gray-600 text-2xl font-medium"
          disabled={!value}
        >
          -
        </button>
        <span className="text-xl font-medium">{value || 0}</span>
      </div>
    </div>
  );
};

ColorCard.propTypes = {
  color: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    color_code: PropTypes.string,
  }).isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const SummaryTable = ({ title, items, colors }) => {
  const total = Object.values(items).reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <h3 className="font-medium mb-2">{title} :-</h3>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-left">#</th>
            <th className="px-2 py-1 text-left">Color</th>
            <th className="px-2 py-1 text-center">Req.</th>
            <th className="px-2 py-1 text-center">Delivery</th>
            <th className="px-2 py-1 text-center">Add</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([colorId, value], index) => {
            const color = colors.find((c) => c.id === parseInt(colorId));
            return (
              <tr key={colorId} className="border-t">
                <td className="px-2 py-1">{index + 1}</td>
                <td className="px-2 py-1">{color?.name || colorId}</td>
                <td className="px-2 py-1 text-center">{value}</td>
                <td className="px-2 py-1 text-center">{value}</td>
                <td className="px-2 py-1 text-center">{value}</td>
              </tr>
            );
          })}
          <tr className="border-t font-medium">
            <td colSpan="2" className="px-2 py-1">
              Total
            </td>
            <td className="px-2 py-1 text-center">{total}</td>
            <td className="px-2 py-1 text-center">{total}</td>
            <td className="px-2 py-1 text-center">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

SummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  colors: PropTypes.array.isRequired,
};

const ColorSelection = ({ party }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [items, setItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, colorsData] = await Promise.all([
          getColorCategories(),
          getColors(),
        ]);

        setCategories(categoriesData);
        setColors(colorsData);
        setActiveTab(categoriesData[0]?.name || null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group colors by subcategory within the active category
  const getColorsByCategory = (categoryName) => {
    const categoryColors = colors.filter(
      (color) => color.category?.name === categoryName
    );

    // Group by subcategory
    const subcategories = {};
    categoryColors.forEach((color) => {
      const subcategoryName = color.subcategory?.name || "Other";
      if (!subcategories[subcategoryName]) {
        subcategories[subcategoryName] = [];
      }
      subcategories[subcategoryName].push(color);
    });

    // Sort subcategories by display_order
    const sortedSubcategories = {};
    Object.keys(subcategories)
      .sort((a, b) => {
        const orderA =
          categoryColors.find((c) => c.subcategory?.name === a)?.subcategory
            ?.display_order || 0;
        const orderB =
          categoryColors.find((c) => c.subcategory?.name === b)?.subcategory
            ?.display_order || 0;
        return orderA - orderB;
      })
      .forEach((key) => {
        sortedSubcategories[key] = subcategories[key].sort(
          (a, b) => a.display_order - b.display_order
        );
      });

    return sortedSubcategories;
  };

  const handleQuantityChange = (colorId, value) => {
    setItems((prev) => ({
      ...prev,
      [colorId]: value,
    }));
  };

  const handleClear = () => {
    setItems({});
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const subcategories = activeTab ? getColorsByCategory(activeTab) : {};

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Party Name</span>
            <span className="text-blue-600">{party.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Address</span>
            <span>{party.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Order ID</span>
            <span className="text-sm">#</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Date</span>
            <input
              type="date"
              className="border rounded px-3 py-1"
              value={new Date().toISOString().split("T")[0]}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Category Tabs */}
          <div className="flex space-x-4 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.name)}
                className={`px-6 py-2 font-medium ${
                  activeTab === category.name
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Colors Grid by Subcategory */}
          {Object.entries(subcategories).map(
            ([subcategoryName, subcategoryColors]) => (
              <div key={subcategoryName} className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  {subcategoryName} :-
                </h3>
                <div className="grid grid-cols-6 gap-4">
                  {subcategoryColors.map((color) => (
                    <ColorCard
                      key={color.id}
                      color={color}
                      value={items[color.id]}
                      onChange={(value) =>
                        handleQuantityChange(color.id, value)
                      }
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Summary Tables */}
        <div className="w-80">
          {categories.map((category) => (
            <SummaryTable
              key={category.id}
              title={category.name}
              items={items}
              colors={colors}
            />
          ))}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="flex-1 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
              Hold
            </button>
            <button
              onClick={handleClear}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear
            </button>
            <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ColorSelection.propTypes = {
  party: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default ColorSelection;
