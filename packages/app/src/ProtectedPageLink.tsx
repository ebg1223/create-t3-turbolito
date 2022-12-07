import React from "react";
import { TextLink } from "solito/link";

export const ProtectedPageLink = () => {
  return (
    <TextLink textProps={{ style: { color: "white" } }} href="/protected">
      Protected
    </TextLink>
  );
};
