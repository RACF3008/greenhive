import fs from "fs";
import path from "path";

export const renderEmail = (
  templateName: string,
  variables: Record<string, string>
) => {
  const templatePath = path.join(__dirname, "../templates/", templateName);
  let template = fs.readFileSync(templatePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\$\\{${key}\\}`, "g");
    template = template.replace(regex, value);
  }

  return template;
};
