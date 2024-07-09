| Before                       | After                        |
|------------------------------|------------------------------|
| ![Before](./path/to/before-image.png)      | ![After](./path/to/after-image.png)        |
| *Documentation without the Glossary tab, keyword cloud, and collapsible sections.* | *Documentation with the Glossary tab, keyword cloud, and collapsible sections.* |

## 🔧 Changes

### Addition of Glossary Tab
- **Before:**
  - The documentation did not have a Glossary tab.
  ![Before Glossary](./path/to/before-glossary-image.png)

- **After:**
  - A new Glossary tab has been added to the navigation menu.
  ![After Glossary](./path/to/after-glossary-image.png)

### Keyword Cloud
- **Before:**
  - No keyword cloud was available.
  ![Before Keywords Cloud](./path/to/before-keywords-cloud-image.png)

- **After:**
  - A dynamic keyword cloud is displayed based on a `keywords.json` file. Keywords are shown according to the visited page. Clicking on a keyword opens a modal with the definition of the word and a "Read more" link redirects to the "keyword/glossary" page.
  ![After Keywords Cloud](./path/to/after-keywords-cloud-image.png)

### Collapsible Sections
- **Before:**
  - Sections were not collapsible, making navigation more difficult.
  ![Before Collapse Sections](./path/to/before-collapse-sections-image.png)

- **After:**
  - Main H2 titles are now in collapsible menus, allowing for better visibility and faster information retrieval.
  ![After Collapse Sections](./path/to/after-collapse-sections-image.png)

### Expertise Level Switch
- **Before:**
  - No switch to select expertise level.
  ![Before Expertise Switch](./path/to/before-expertise-switch-image.png)

- **After:**
  - Added a switch at the top left to choose the expertise level (expert or beginner). Displayed keywords and sections change based on the selected level.
  ![After Expertise Switch](./path/to/after-expertise-switch-image.png)

### Top Navigation
- **Before:**
  - No button to quickly navigate back to the top of the page.
  ![Before Navigation Top](./path/to/before-navigation-top-image.png)

- **After:**
  - Added an icon button that appears after scrolling, allowing immediate navigation back to the top of the page.
  ![After Navigation Top](./path/to/after-navigation-top-image.png)

### Static URL for JavaScript Bundle
- **Before:**
  - Using a dynamic URL for the JavaScript bundle resulted in several features not working, such as the search bar and the top navigation button.
  ```html
  <script src="{{ 'assets/javascripts/bundle.min.js' | url }}"></script>
  <script src="{{ 'assets/javascripts/bundle.*.min.js' | url }}"></script>

<script src="{{ 'assets/javascripts/bundle.fe8b6f2b.min.js' | url }}"></script>
