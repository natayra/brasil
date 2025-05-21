import { Box, Typography, Stack, Card, CardContent } from "@mui/material";
import theme from "../theme";

const tabs = [
  "Data Canvas",
  //"Data Explorer",
  "Dashboards",
  "ChatPDF",
  "Configurações",
];

const SideBar = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  submittedQuestions,
}) => {
  if (!isLoggedIn) return null;

  const onDragStart = (e, item) => {
    const payload = {
      label: item.ds_texto_pergunta,
      query: item.ds_texto_pergunta,
      id: item.id_pergunta, 
    };
    e.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box
      sx={{
        width: 300,
        background: "#fff",
        borderRight: "1px solid #ddd",
        p: 2,
        pt: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
      }}
    >
      <Box>
        <Typography variant="h6" textAlign="center" fontWeight={600} mb={2}>
          Navegação
        </Typography>
        <Stack spacing={1}>
          {tabs.map((t) => (
            <Typography
              key={t}
              onClick={() => setActiveTab(t)}
              sx={{
                cursor: "pointer",
                fontSize: 16,
                fontWeight: activeTab === t ? 600 : 400,
                color: "#333",
              }}
            >
              {t}
            </Typography>
          ))}
        </Stack>

        <Box mt={5}>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            Últimas pesquisas
          </Typography>
          <Box
            sx={{
              overflowY: "scroll",
              maxHeight: "40vh",
              scrollbarWidth: "0px",
            }}
          >
            {submittedQuestions.slice().reverse().map((item, i) => (
              <Card
                key={i}
                draggable
                onDragStart={(e) => onDragStart(e, item)}
                sx={{
                  cursor: "grab",
                  "&:hover": { background: theme.palette.background.default },
                  transition: "transform 0.2s",
                }}
              >
                <CardContent sx={{ padding: "0.5rem", height: "2.5rem" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      fontSize: 15,
                    }}
                  >
                    {item.ds_texto_pergunta}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default SideBar;
