import {
  initializeBlock,
  useBase,
  useRecords,
  expandRecord,
  useCustomProperties,
} from "@airtable/blocks/interface/ui";
import { useState, useCallback } from "react";
import { FieldType } from "@airtable/blocks/interface/models";
import "./style.css";
import Html5QrcodePlugin from "./components/Html5QrcodePlugin";

function getCustomProperties(base: any) {
  const table = base.tables[0];

  // Find a text field that could be used as the lookup field
  const textFields = table.fields.filter(
    (field: any) =>
      field.type === FieldType.SINGLE_LINE_TEXT ||
      field.type === FieldType.MULTILINE_TEXT ||
      field.type === FieldType.BARCODE
  );

  return [
    {
      key: "table",
      label: "Table",
      type: "table" as const,
      defaultValue: table,
    },
    {
      key: "lookupField",
      label: "Lookup Field (field to match scanned QR code)",
      type: "field" as const,
      table: table,
      shouldFieldBeAllowed: (field: any) =>
        field.config.type === FieldType.SINGLE_LINE_TEXT ||
        field.config.type === FieldType.MULTILINE_TEXT ||
        field.config.type === FieldType.BARCODE,
      defaultValue: textFields[0],
    },
  ];
}

function App() {
  const base = useBase();
  const { customPropertyValueByKey, errorState } =
    useCustomProperties(getCustomProperties);
  const [scannedItem, setScannedItem] = useState<string | null>(null);

  const table = customPropertyValueByKey.table as any;
  const lookupField = customPropertyValueByKey.lookupField as any;
  const records = useRecords(table);

  // Find the matching record
  const matchingRecord = scannedItem
    ? records.find((record) => {
        const cellValue = record.getCellValueAsString(lookupField);
        return cellValue === scannedItem;
      })
    : null;

  const handleOpenDetails = useCallback(() => {
    if (matchingRecord) {
      expandRecord(matchingRecord);
    }
  }, [matchingRecord]);

  const handleAddItem = useCallback(async () => {
    if (!scannedItem || !table || !lookupField) return;

    // Check permission before creating
    if (!table.hasPermissionToCreateRecords()) {
      alert("You don't have permission to create records in this table.");
      return;
    }

    try {
      const newRecordId = await table.createRecordAsync({
        [lookupField.id]: scannedItem,
      });

      // Open the newly created record
      const newRecord = records.find((r) => r.id === newRecordId);
      if (newRecord) {
        expandRecord(newRecord);
      }
    } catch (error) {
      console.error("Failed to create record:", error);
      alert("Failed to create record. Please try again.");
    }
  }, [scannedItem, table, lookupField, records]);

  if (errorState) {
    return (
      <div className="p-4 text-red-600">Error: {errorState.error.message}</div>
    );
  }

  if (!table || !lookupField) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Configure Custom Properties</h2>
        <p>
          Please configure the table and lookup field in the properties panel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Left side - Camera scanner */}
      <div className="w-[150px] h-[150px] flex-shrink-0">
        <Html5QrcodePlugin
          fps={10}
          qrbox={{ width: 120, height: 120 }}
          qrCodeSuccessCallback={(decodedText, decodedResult) => {
            console.log(decodedText, decodedResult);
            setScannedItem(decodedText);
          }}
          qrCodeErrorCallback={(errorMessage) => {
            console.error(errorMessage);
          }}
        />
      </div>

      {/* Right side - Display scanned item and actions */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {scannedItem ? (
          <div className="w-full max-w-md">
            {/* Scanned item at the top */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">
                Currently Scanned Item
              </h2>
              <p className="text-xl break-all bg-gray-100 p-4 rounded-lg">
                {scannedItem}
              </p>
            </div>

            {/* Conditional buttons/warnings below */}
            <div className="mt-6">
              {matchingRecord ? (
                // Item found - show Open Details button
                <button
                  onClick={handleOpenDetails}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Open Details
                </button>
              ) : (
                // Item not found - show warning and Add Item button
                <div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-semibold">
                          Item not found
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleAddItem}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-xl">No item scanned yet</p>
            <p className="text-sm mt-2">Scan a QR code to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}

initializeBlock({ interface: () => <App /> });
