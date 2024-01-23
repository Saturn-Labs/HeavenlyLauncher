import Version from "@renderer/internal/Version";

export namespace Json {
  export function Serialize<T>(value: T): string {
    return JSON.stringify(value, (key, value) => {
      return value;
    });
  }

  export function Deserialize<T>(text: string): T {
    const jsonVal = JSON.parse(text, (key, value) => {
      return value;
    }) as T;
    return jsonVal;
  }
}