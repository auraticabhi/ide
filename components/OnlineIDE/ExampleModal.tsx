import { LanguageCode, ProjectData } from '@/types/ide';
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect, Dispatch, SetStateAction } from 'react';

let examples = [
    {
        name: 'numpy',
        example:
            "# Basic array operations and mathematical computations\n\
import numpy as np\n\
\n\
# Create two arrays\n\
arr1 = np.array([1, 2, 3, 4, 5])\n\
arr2 = np.array([6, 7, 8, 9, 10])\n\
\n\
# Perform operations\n\
sum_arr = arr1 + arr2\n\
dot_product = np.dot(arr1, arr2)\n\
mean_val = np.mean(arr1)\n\
\n\
print(f'Sum: {sum_arr}')\n\
print(f'Dot product: {dot_product}')\n\
print(f'Mean: {mean_val}')",
    },
    {
        name: 'pandas',
        example:
            "# Data manipulation and analysis\n\
import pandas as pd\n\
\n\
# Input: Create or load a CSV file with columns: 'Name', 'Age', 'Salary'\n\
\n\
# Create sample DataFrame\n\
data = {\n\
    'Name': ['John', 'Alice', 'Bob'],\n\
    'Age': [28, 24, 32],\n\
    'Salary': [50000, 45000, 60000]\n\
}\n\
\n\
df = pd.DataFrame(data)\n\
\n\
# Basic operations\n\
print('Basic statistics:\\n', df.describe())\n\
print('\\nFiltered data (Age > 25):\\n', df[df['Age'] > 25])",
    },
    {
        name: 'scipy',
        example:
            "# Scientific computing example with optimization\n\
from scipy import optimize\n\
import numpy as np\n\
\n\
# Define a function to minimize\n\
def objective(x):\n\
    return (x[0] - 1)**2 + (x[1] - 2)**2\n\
\n\
# Initial guess\n\
x0 = [0, 0]\n\
\n\
# Minimize the function\n\
result = optimize.minimize(objective, x0)\n\
print('Optimal values:', result.x)\n\
print('Minimum value:', result.fun)",
    },
    {
        name: 'sympy',
        example:
            "# Symbolic mathematics\n\
import sympy as sp\n\
\n\
# Define symbolic variables\n\
x, y = sp.symbols('x y')\n\
expr = x**2 + 2*x*y + y**2\n\
\n\
# Perform symbolic operations\n\
derivative = sp.diff(expr, x)\n\
expanded = sp.expand(expr)\n\
solved = sp.solve(expr, y)\n\
\n\
print(f'Expression: {expr}')\n\
print(f'Derivative: {derivative}')\n\
print(f'Expanded: {expanded}')",
    },
    {
        name: 'scikit-learn',
        example:
            "# Machine learning example with iris dataset\n\
from sklearn.datasets import load_iris\n\
from sklearn.model_selection import train_test_split\n\
from sklearn.ensemble import RandomForestClassifier\n\
\n\
# Load data\n\
iris = load_iris()\n\
X, y = iris.data, iris.target\n\
\n\
# Split data\n\
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)\n\
\n\
# Train model\n\
model = RandomForestClassifier(n_estimators=100)\n\
model.fit(X_train, y_train)\n\
\n\
# Evaluate\n\
score = model.score(X_test, y_test)\n\
print(f'Model accuracy: {score:.2f}')",
    },
    {
        name: 'matplotlib',
        example:
            "# Data visualization\n\
import matplotlib.pyplot as plt\n\
import numpy as np\n\
\n\
# Generate data\n\
x = np.linspace(0, 10, 100)\n\
y1 = np.sin(x)\n\
y2 = np.cos(x)\n\
\n\
# Create plot\n\
plt.figure(figsize=(10, 6))\n\
plt.plot(x, y1, label='sin(x)')\n\
plt.plot(x, y2, label='cos(x)')\n\
plt.title('Sine and Cosine Functions')\n\
plt.xlabel('x')\n\
plt.ylabel('y')\n\
plt.legend()\n\
plt.grid(True)\n\
plt.show()",
    },
    {
        name: 'seaborn',
        example:
            "# Statistical data visualization\n\
import seaborn as sns\n\
import numpy as np\n\
import pandas as pd\n\
\n\
# Create sample dataset\n\
np.random.seed(42)\n\
data = {\n\
    'group': ['A']*50 + ['B']*50,\n\
    'values': np.concatenate([np.random.normal(0, 1, 50), np.random.normal(2, 1, 50)])\n\
}\n\
df = pd.DataFrame(data)\n\
\n\
# Create violin plot\n\
plt.figure(figsize=(10, 6))\n\
sns.violinplot(x='group', y='values', data=df)\n\
plt.title('Distribution Comparison')\n\
plt.show()",
    },
    {
        name: 'plotly',
        example:
            "# Interactive plotting\n\
import plotly.express as px\n\
import pandas as pd\n\
import numpy as np\n\
\n\
# Create sample data\n\
np.random.seed(42)\n\
df = pd.DataFrame({\n\
    'x': range(20),\n\
    'y': np.random.normal(0, 1, 20),\n\
    'size': np.random.uniform(10, 20, 20)\n\
})\n\
\n\
# Create interactive scatter plot\n\
fig = px.scatter(df, x='x', y='y', \n\
                size='size',\n\
                title='Interactive Scatter Plot')\n\
fig.show()",
    },
    {
        name: 'bokeh',
        example:
            "# Interactive visualization\n\
from bokeh.plotting import figure, show\n\
from bokeh.io import output_notebook\n\
import numpy as np\n\
\n\
# Generate data\n\
x = np.linspace(0, 10, 100)\n\
y = np.sin(x) * np.exp(-0.1 * x)\n\
\n\
# Create Bokeh plot\n\
p = figure(title='Damped Sine Wave', \n\
          x_axis_label='x',\n\
          y_axis_label='y')\n\
p.line(x, y, line_color='blue', line_width=2)\n\
\n\
# Display plot\n\
show(p)",
    },
    {
        name: 'networkx',
        example:
            "# Graph and network analysis\n\
import networkx as nx\n\
import matplotlib.pyplot as plt\n\
\n\
# Create a graph\n\
G = nx.Graph()\n\
\n\
# Add edges\n\
edges = [(1, 2), (1, 3), (2, 3), (3, 4), (4, 5)]\n\
G.add_edges_from(edges)\n\
\n\
# Calculate some network metrics\n\
print('Number of nodes:', G.number_of_nodes())\n\
print('Number of edges:', G.number_of_edges())\n\
print('Average shortest path length:', nx.average_shortest_path_length(G))\n\
\n\
# Draw the graph\n\
plt.figure(figsize=(8, 6))\n\
nx.draw(G, with_labels=True, node_color='lightblue')\n\
plt.title('Simple Network Graph')\n\
plt.show()",
    },
    {
        name: 'statsmodels',
        example:
            '# Statistical modeling\n\
import statsmodels.api as sm\n\
import numpy as np\n\
\n\
# Generate sample data\n\
np.random.seed(42)\n\
X = np.random.randn(100, 2)\n\
y = 2 + 3*X[:, 0] + 4*X[:, 1] + np.random.randn(100)\n\
\n\
# Add constant for intercept\n\
X = sm.add_constant(X)\n\
\n\
# Fit linear regression model\n\
model = sm.OLS(y, X)\n\
results = model.fit()\n\
\n\
# Print summary\n\
print(results.summary())',
    },
    {
        name: 'autograd',
        example:
            "# Automatic differentiation\n\
import autograd.numpy as np\n\
from autograd import grad\n\
\n\
# Define a function\n\
def f(x):\n\
    return np.sin(x) * np.exp(-x**2)\n\
\n\
# Get the gradient function\n\
grad_f = grad(f)\n\
\n\
# Evaluate at some points\n\
x = np.linspace(-2, 2, 5)\n\
print('x values:', x)\n\
print('Gradient values:', grad_f(x))",
    },
    {
        name: 'scikit-image',
        example:
            "# Edge detection with Sobel filter\n\
    from skimage import data, color, filters\n\
    import matplotlib.pyplot as plt\n\
    \n\
    # Load an example image\n\
    image = color.rgb2gray(data.camera())\n\
    \n\
    # Apply Sobel filter for edge detection\n\
    edges = filters.sobel(image)\n\
    \n\
    # Plot the original and processed images\n\
    fig, ax = plt.subplots(1, 2, figsize=(10, 5))\n\
    ax[0].imshow(image, cmap='gray')\n\
    ax[0].set_title('Original Image')\n\
    ax[1].imshow(edges, cmap='gray')\n\
    ax[1].set_title('Edge Detection using Sobel Filter')\n\
    plt.show()",
    },
    {
        name: 'Pillow',
        example:
            "# Image processing with Pillow\n\
    from PIL import Image, ImageFilter\n\
    import matplotlib.pyplot as plt\n\
    \n\
    # Open an image\n\
    image = Image.open('example.jpg')\n\
    \n\
    # Apply a Gaussian blur filter\n\
    blurred_image = image.filter(ImageFilter.GaussianBlur(5))\n\
    \n\
    # Show the original and blurred images\n\
    fig, ax = plt.subplots(1, 2, figsize=(10, 5))\n\
    ax[0].imshow(image)\n\
    ax[0].set_title('Original Image')\n\
    ax[1].imshow(blurred_image)\n\
    ax[1].set_title('Blurred Image with Gaussian Filter')\n\
    plt.show()",
    },
    
];

const ExampleModal: React.FC<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedLanguage: LanguageCode;
    setCode :  Dispatch<SetStateAction<string>>;
}> = ({ isOpen, setIsOpen, selectedLanguage,setCode }) => {

    const exampleOpenHandler = (code : string) => {
        setCode(code)
        setIsOpen(false)
    }

    return (
        <div onClick={() => setIsOpen(true)}>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60 px-4">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel className="panel my-8 w-full  max-w-5xl  rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c] ">
                                    <h5 className="text-lg font-bold">ML Libraries Examples</h5>
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-2 text-white-dark hover:text-dark">
                                        X
                                    </button>
                                </div>
                                <div className="h-96 ">
                                    <div className="hidescrollbar my-5  grid max-h-96 w-full grid-cols-1 items-start justify-start gap-4 overflow-scroll px-5 pb-5  md:grid-cols-2 lg:grid-cols-3">
                                        {examples?.map((example) => (
                                            <div key={example.name} className="cursor-pointer group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md" onClick={() => exampleOpenHandler(example.example)}>
                                                <div className="p-6">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-semibold text-gray-900">{example.name}</h3>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-500">Example Code</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ExampleModal;
