export const createFolderFromTemplate = (template) => {
  const newFolder = {
    id: Date.now().toString(),
    name: template.name,
    description: template.description,
    createdAt: new Date().toISOString(),
    timers: [],
  };

  const newTimers = template.timers.map(timer => ({
    ...timer,
    id: `${newFolder.id}_${timer.id}`,
    createdAt: newFolder.createdAt,
    folderId: newFolder.id
  }));

  return { folder: newFolder, timers: newTimers };
}; 