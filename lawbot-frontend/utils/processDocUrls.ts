interface DocumentLike {
  doc_id: string | null | undefined;
  source_table?: string | null | undefined; // From FavoriteItem
  category?: string | null | undefined; // Alternative if source_table isn't present
  url?: string; // The property we will add/update
  [key: string]: any; // Allow other properties
}

/**
 * Processes an array of document-like objects (e.g., FavoriteItem) by setting their
 * url property based on their source_table/category and doc_id.
 *
 * @param documents - An array of document-like objects.
 * @returns The same array of documents with the 'url' attribute set.
 */
export function processDocumentUrls<T extends DocumentLike>(documents: T[]): T[] {
  if (!Array.isArray(documents)) {
    //console.error("processDocumentUrls expects an array, received:", documents);
    return []; // Return empty array or handle error as appropriate
  }

  return documents.map(doc => {
    // Ensure we don't modify the original object directly if immutability is desired,
    // but for simplicity here, we'll modify in place. Create a copy if needed:
    // const processedDoc = { ...doc };

    const category = doc.source_table || doc.category; // Prefer source_table
    const doc_id = doc.doc_id;
    let url: string | null = null; // Initialize url

    if (!category || !doc_id) {
      // Skip if essential info is missing, set default empty url
      doc.url = '';
      return doc;
    }

    // Generate URL based on category, following the Python logic
    if (category === "article_content") {
      // F0120019_A_3 => /law/F0120019#F0120019_A_3
      // F0120019_A_18-3 => /law/F0120019#F0120019_A_18-3
      const baseId = doc_id.split('_')[0];
      url = `/law/${baseId}#${doc_id}`;

    } else if (category === 'administrative_article_content') {
      // MOJ_FL104546_A_1 => /administrative_rules/MOJ_FL104546#MOJ_FL104546_A_1
      // judicial_FL200001_A_2-3 => /administrative_rules/judicial_FL200001#judicial_FL200001_A_2-3
      const parts = doc_id.split('_');
      if (parts.length >= 2) {
        const baseId = `${parts[0]}_${parts[1]}`;
        url = `/administrative_rules/${baseId}#${doc_id}`;
      } else {
        // Fallback if format is unexpected, though Python example didn't specify one
        url = `/administrative_rules/${doc_id}#${doc_id}`; // Keep existing fallback
      }

    } else if (category === 'administrative_rules') {
      // MOJ_FL104546 => /administrative_rules/MOJ_FL104546
      // judicial_FL200001 => /administrative_rules/judicial_FL200001
      // Note: Python code checks if doc_id starts with MOJ or judicial,
      // but the TS category already implies this. Assuming category is reliable.
      url = `/administrative_rules/${doc_id}`;

    } else {
      // Generic fallback for all other categories
      url = `/${category}/${doc_id}`;
    }

    // Assign the URL back to the document object
    doc.url = url || ''; // Ensure url is always a string

    return doc;
  });
}
