import React from 'react';

export enum ToolType {
  BASE64 = 'BASE64',
  JWT = 'JWT',
  JSON_FORMATTER = 'JSON_FORMATTER',
  XML_FORMATTER = 'XML_FORMATTER',
  DATA_CONVERTER = 'DATA_CONVERTER',
  WORLD_TIME = 'WORLD_TIME',
  URL = 'URL',
  UUID = 'UUID',
  DIFF = 'DIFF',
  REGEX = 'REGEX',
  TIMESTAMP = 'TIMESTAMP',
}

export interface NavItem {
  id: ToolType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface TimeZone {
  label: string;
  region: string;
  id: string; // IANA time zone identifier
}